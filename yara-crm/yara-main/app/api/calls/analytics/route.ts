import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'today'; // today, week, month

    let dateFilter = '';
    const now = new Date();
    
    switch (period) {
      case 'today':
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        dateFilter = `started_at >= '${today.toISOString()}'`;
        break;
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        dateFilter = `started_at >= '${weekAgo.toISOString()}'`;
        break;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        dateFilter = `started_at >= '${monthAgo.toISOString()}'`;
        break;
    }

    // Get total calls
    const { count: totalCalls } = await supabase
      .from('calls')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .filter('started_at', 'gte', dateFilter.split("'")[1]);

    // Get answered calls
    const { count: answeredCalls } = await supabase
      .from('calls')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .filter('started_at', 'gte', dateFilter.split("'")[1]);

    // Get missed calls
    const { count: missedCalls } = await supabase
      .from('calls')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .in('status', ['missed', 'no-answer', 'busy'])
      .filter('started_at', 'gte', dateFilter.split("'")[1]);

    // Get average duration
    const { data: durationData } = await supabase
      .from('calls')
      .select('duration')
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .filter('started_at', 'gte', dateFilter.split("'")[1]);

    const avgDuration = durationData && durationData.length > 0
      ? Math.round(durationData.reduce((sum, call) => sum + (call.duration || 0), 0) / durationData.length)
      : 0;

    // Get call distribution by direction
    const { data: directionData } = await supabase
      .from('calls')
      .select('direction')
      .eq('user_id', user.id)
      .filter('started_at', 'gte', dateFilter.split("'")[1]);

    const incomingCount = directionData?.filter(call => call.direction === 'incoming').length || 0;
    const outgoingCount = directionData?.filter(call => call.direction === 'outgoing').length || 0;

    // Calculate answer rate
    const answerRate = totalCalls && totalCalls > 0 ? Math.round((answeredCalls || 0) / totalCalls * 100) : 0;

    // Format average duration
    const formatDuration = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const analytics = {
      totalCalls: totalCalls || 0,
      answeredCalls: answeredCalls || 0,
      missedCalls: missedCalls || 0,
      avgDuration: formatDuration(avgDuration),
      avgDurationSeconds: avgDuration,
      answerRate,
      incomingCalls: incomingCount,
      outgoingCalls: outgoingCount,
      callQuality: 92, // Mock data - you can implement actual quality metrics
      period
    };

    return NextResponse.json({ analytics });
  } catch (error) {
    console.error('Error in calls analytics API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
