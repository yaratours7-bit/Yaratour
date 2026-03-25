import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import Papa from 'papaparse';

export async function POST(request: Request) {
  const supabase = await createClient();
  
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const text = await file.text();

    // Use PapaParse to correctly handle quoted fields and commas inside values
    const parsed = Papa.parse<Record<string, string>>(text, {
      header: true,
      skipEmptyLines: true,
    });

    if (parsed.errors && parsed.errors.length > 0) {
      console.error('CSV parse errors:', parsed.errors);
    }

    const rows = parsed.data;

    const leads = [] as { name: string; email: string; source: string; phone: string }[];

    // Determine header keys in a case-insensitive way
    const normalize = (s: string) => s.toLowerCase();

    for (const row of rows) {
      // Map columns by looking for keys that include the expected words
      const entries = Object.entries(row).filter(([key]) => key.trim().length > 0);
      const getVal = (predicate: (k: string) => boolean) => {
        const found = entries.find(([key]) => predicate(normalize(key)));
        return (found?.[1] || '').trim();
      };

      const name = getVal(k => k.includes('name') && !k.includes('email'));
      const email = getVal(k => k.includes('email'));
      let source = getVal(k => k.includes('source')) || 'CSV Import';

      // Normalize Meta/Facebook paid source
      if (source.toLowerCase() === 'paid') {
        source = 'Meta';
      }

      const primaryPhone = getVal(k => k.includes('phone') && !k.includes('secondary') && !k.includes('whatsapp'));
      const secondaryPhone = getVal(k => k.includes('secondary') && k.includes('phone'));
      const phone = primaryPhone || secondaryPhone;

      if (name && email) {
        leads.push({ name, email, source, phone });
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
    console.error('Error processing CSV file', error);
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
