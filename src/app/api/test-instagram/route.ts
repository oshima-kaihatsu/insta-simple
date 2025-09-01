import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // 最小限のテストレスポンス
  return NextResponse.json({
    connected: true,
    profile: {
      username: 'test_account',
      followers_count: 1000
    },
    posts: [
      {
        id: 'test_1',
        caption: 'Working Test Post 1',
        media_type: 'IMAGE',
        timestamp: '2024-01-01T00:00:00Z',
        insights: { 
          reach: 100, 
          likes: 10,
          saves: 2,
          comments: 3
        }
      },
      {
        id: 'test_2',
        caption: 'Working Test Post 2',
        media_type: 'IMAGE',
        timestamp: '2024-01-02T00:00:00Z',
        insights: { 
          reach: 150, 
          likes: 15,
          saves: 3,
          comments: 5
        }
      },
      {
        id: 'test_3',
        caption: 'Working Test Post 3',
        media_type: 'IMAGE',
        timestamp: '2024-01-03T00:00:00Z',
        insights: { 
          reach: 200, 
          likes: 20,
          saves: 4,
          comments: 7
        }
      }
    ]
  });
}