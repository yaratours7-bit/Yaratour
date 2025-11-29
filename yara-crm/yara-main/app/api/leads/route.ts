import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const text = await file.text();
    const lines = text.split('\n');
    const headers = lines[0].split(',');
    
    // Find the indices of the columns we need
    const nameIndex = headers.findIndex(h => h.toLowerCase().includes('name'));
    const emailIndex = headers.findIndex(h => h.toLowerCase().includes('email'));
    const sourceIndex = headers.findIndex(h => h.toLowerCase().includes('source'));
    const phoneIndex = headers.findIndex(h => h.toLowerCase().includes('phone') && !h.toLowerCase().includes('secondary') && !h.toLowerCase().includes('whatsapp'));
    const secondaryPhoneIndex = headers.findIndex(h => h.toLowerCase().includes('secondary phone'));
    
    const leads = [];
    
    // Process each data row (skip header)
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const columns = line.split(',');
      
      const rawSource = columns[sourceIndex]?.trim() || 'CSV Import';
      const source = rawSource.toLowerCase() === 'paid' ? 'Meta' : rawSource;
      
      // Use primary phone, fallback to secondary phone if primary is empty
      const primaryPhone = columns[phoneIndex]?.trim() || '';
      const secondaryPhone = columns[secondaryPhoneIndex]?.trim() || '';
      const phone = primaryPhone || secondaryPhone;
      
      const lead = {
        name: columns[nameIndex]?.trim() || '',
        email: columns[emailIndex]?.trim() || '',
        source: source,
        phone: phone,
      };
      
      // Only add leads with at least name and email
      if (lead.name && lead.email) {
        leads.push(lead);
      }
    }
    
    if (leads.length === 0) {
      return NextResponse.json({ error: 'No valid leads found in CSV' }, { status: 400 });
    }
    
    // Check for existing leads to prevent duplicates
    const emails = leads.map(lead => lead.email);
    const { data: existingLeads } = await supabase
      .from('leads')
      .select('email')
      .in('email', emails);
    
    const existingEmails = new Set(existingLeads?.map(lead => lead.email) || []);
    const newLeads = leads.filter(lead => !existingEmails.has(lead.email));
    const duplicateCount = leads.length - newLeads.length;
    
    if (newLeads.length === 0) {
      return NextResponse.json({ 
        error: 'All leads already exist in the database',
        duplicates: duplicateCount 
      }, { status: 400 });
    }
    
    // Insert only new leads into database
    const { data, error } = await supabase
      .from('leads')
      .insert(newLeads)
      .select();
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    const message = duplicateCount > 0 
      ? `Successfully imported ${newLeads.length} leads. ${duplicateCount} duplicates were skipped.`
      : `Successfully imported ${newLeads.length} leads`;
    
    return NextResponse.json({ 
      message,
      imported: newLeads.length,
      duplicates: duplicateCount,
      data 
    });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process CSV file' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const leadId = searchParams.get('id');

  if (!leadId) {
    return NextResponse.json(
      { error: 'Lead ID is required' },
      { status: 400 }
    );
  }

  try {
    // First, delete any related events for this lead
    const { error: eventsError } = await supabase
      .from('events')
      .delete()
      .eq('lead_id', leadId);

    if (eventsError) {
      return NextResponse.json({ error: `Failed to delete related events: ${eventsError.message}` }, { status: 400 });
    }

    // Then delete the lead
    const { error: leadError } = await supabase
      .from('leads')
      .delete()
      .eq('id', leadId);

    if (leadError) {
      return NextResponse.json({ error: leadError.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'Lead and related events deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete lead' },
      { status: 500 }
    );
  }
}
