import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');
    const accessToken = searchParams.get('accessToken');

    if (!postId || !accessToken) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Instagram Graph API からインサイトデータを取得
    const insightsUrl = `https://graph.facebook.com/v18.0/${postId}/insights?metric=impressions,reach,saved,profile_visits,follows&access_token=${accessToken}`;
    
    const response = await fetch(insightsUrl);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch insights');
    }

    // データを整形
    const insights: Record<string, number> = {};
    
    if (data.data) {
      data.data.forEach((metric: { name: string; values: Array<{ value: number }> }) => {
        const metricName = metric.name as string;
        const metricValue = metric.values?.[0]?.value as number || 0;
        const followerReach = metric.values?.[0]?.value as number || 0;
        const profileVisits = metric.values?.[0]?.value as number || 0;
        const follows = metric.values?.[0]?.value as number || 0;
        
        insights[metricName] = metricValue;
      });
    }

    return NextResponse.json({ insights });

  } catch (error) {
    console.error('Error fetching insights:', error);
    return NextResponse.json(
      { error: 'Failed to fetch insights' },
      { status: 500 }
    );
  }
}