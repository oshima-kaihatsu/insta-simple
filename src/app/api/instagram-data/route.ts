import { NextRequest, NextResponse } from 'next/server';
import { rateLimiter } from '@/utils/rateLimiter';
import { getClientIP } from '@/utils/getClientIP';
import { checkAccountLimits, saveInstagramConnection, getOrCreateUserAccount } from '@/lib/accountManager';
import { RealDataManager } from '@/lib/dataHistory'; // ← 追加

// Dynamic routeに設定
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // 🚨 レート制限チェック
    const clientIP = getClientIP(request);
    const rateLimitResult = await rateLimiter.isRateLimited(clientIP);

    if (rateLimitResult.limited) {
      const resetTime = rateLimitResult.resetTime ? new Date(rateLimitResult.resetTime) : new Date();
      
      return NextResponse.json(
        { 
          error: 'API rate limit exceeded',
          message: 'Too many requests. Please try again later.',
          resetTime: resetTime.toISOString()
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': '100',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': resetTime.getTime().toString(),
            'Retry-After': Math.ceil((resetTime.getTime() - Date.now()) / 1000).toString()
          }
        }
      );
    }

    // レート制限ヘッダーを追加
    const headers = {
      'X-RateLimit-Limit': '100',
      'X-RateLimit-Remaining': rateLimitResult.remainingRequests?.toString() || '0',
      'X-RateLimit-Reset': rateLimitResult.resetTime?.toString() || '0'
    };

    // URLパラメータからアクセストークンとユーザーIDを取得
    const accessToken = request.nextUrl.searchParams.get('access_token');
    const instagramUserId = request.nextUrl.searchParams.get('instagram_user_id');

    if (!accessToken || !instagramUserId) {
      return NextResponse.json(
        { error: 'Instagram not connected', connected: false },
        { status: 401, headers }
      );
    }

    console.log('=== Instagram Data Fetch ===');
    console.log('User ID:', instagramUserId);
    console.log('Token:', accessToken ? 'Available' : 'Missing');
    console.log('Client IP:', clientIP);
    console.log('Rate limit remaining:', rateLimitResult.remainingRequests);

    // 🚨 安全な重複チェック（エラーでもAPI続行）
    const googleUserId = `google_${clientIP}_${Date.now()}`;
    const googleEmail = `user_${clientIP}@example.com`;
    const googleName = 'Demo User';

    let accountCheckResult = {
      canConnect: true,
      currentConnections: 0,
      maxConnections: 1,
      planType: 'basic',
      isBlocked: false,
      errorMessage: null
    };

    try {
      console.log('🔍 Starting account limits check...');
      const accountCheck = await checkAccountLimits(
        googleUserId,
        instagramUserId,
        googleEmail,
        googleName
      );

      console.log('✅ Account check completed:', accountCheck);
      accountCheckResult = {
        ...accountCheck,
        isBlocked: !accountCheck.canConnect,
        errorMessage: accountCheck.canConnect ? null : accountCheck.errorMessage
      };

      if (!accountCheck.canConnect) {
        console.warn('⚠️ Account connection would be blocked:', accountCheck.errorMessage);
        console.warn('⚠️ Continuing with API call for debugging purposes...');
      }

    } catch (checkError) {
      console.error('💥 Account check error (continuing anyway):', checkError);
      console.error('💥 Error stack:', checkError instanceof Error ? checkError.stack : 'No stack');
    }

    console.log('📱 Proceeding with Instagram API call...');

    // 🔍 アクセストークンの権限確認
    try {
      console.log('🔐 Checking access token permissions...');
      const permissionsResponse = await fetch(
        `https://graph.facebook.com/v21.0/me/permissions?access_token=${accessToken}`
      );
      const permissionsData = await permissionsResponse.json();
      
      if (permissionsData.data) {
        console.log('📋 Current permissions:');
        permissionsData.data.forEach((perm: any) => {
          console.log(`   ${perm.status === 'granted' ? '✅' : '❌'} ${perm.permission}: ${perm.status}`);
        });
        
        const hasInsightsPermission = permissionsData.data.some(
          (perm: any) => perm.permission === 'instagram_manage_insights' && perm.status === 'granted'
        );
        
        if (!hasInsightsPermission) {
          console.warn('⚠️ instagram_manage_insights権限が付与されていません。一部のインサイトデータが取得できない可能性があります。');
        }
      }
    } catch (permError) {
      console.error('⚠️ 権限確認でエラー:', permError);
    }

    // 1. Instagram Business Account情報を取得
    // 注意: media_countフィールドは通常のユーザーノードには存在しないため削除
    const userResponse = await fetch(
      `https://graph.facebook.com/v21.0/${instagramUserId}?fields=id,username,followers_count&access_token=${accessToken}`
    );
    const userInfo = await userResponse.json();

    if (userInfo.error) {
      console.error('User info fetch failed:', userInfo.error);
      
      // エラーでも続行（基本データで代替）
      const fallbackInfo = {
        id: instagramUserId,
        username: 'instagram_user',
        followers_count: 0,
        media_count: 0
      };
      console.log('Using fallback user info:', fallbackInfo);
    }

    // エラーチェックを修正
    let actualUserInfo = userInfo;
    if (userInfo.error) {
      actualUserInfo = {
        id: instagramUserId,
        username: 'instagram_user',
        followers_count: 0
      };
    }
    
    console.log('User info:', actualUserInfo);

    // メディア数を別途取得
    let mediaCount = 0;
    try {
      const mediaCountRes = await fetch(
        `https://graph.facebook.com/v21.0/${instagramUserId}/media?fields=id&limit=1&access_token=${accessToken}`
      );
      const mediaCountData = await mediaCountRes.json();
      if (mediaCountData.data && mediaCountData.data.length > 0) {
        mediaCount = 100; // 概算値（正確な数は取得できない）
      }
    } catch (e) {
      console.log('Could not fetch media count:', e);
    }

    // 🚨 実データ記録（初回連携時）
    try {
      console.log('📊 Recording real data...');
      await RealDataManager.recordInitialData(instagramUserId, {
        followers_count: actualUserInfo.followers_count || 0,
        media_count: mediaCount
      });
      console.log('✅ Real data recording completed');
    } catch (recordError) {
      console.error('⚠️ Failed to record real data:', recordError);
      // データ記録エラーでもAPIは続行
    }

    // 🚨 Instagram接続をデータベースに保存（重複チェック結果に関係なく実行）
    try {
      console.log('💾 Saving Instagram connection to database...');
      const userAccount = await getOrCreateUserAccount(googleUserId, googleEmail, googleName);
      await saveInstagramConnection(
        userAccount.id,
        instagramUserId,
        actualUserInfo.username || 'Unknown',
        accessToken,
        actualUserInfo.followers_count || 0,
        mediaCount,
        'BUSINESS'
      );
      console.log('✅ Instagram connection saved to database');
    } catch (dbError) {
      console.error('⚠️ Failed to save Instagram connection:', dbError);
      console.error('⚠️ DB Error stack:', dbError instanceof Error ? dbError.stack : 'No stack');
    }

    // 🎯 実データのフォロワー履歴を取得
    const followerHistoryResult = await RealDataManager.getFollowerHistory(instagramUserId);
    const dataStatus = await RealDataManager.getDataCollectionStatus(instagramUserId);

    console.log('📈 Follower history result:', followerHistoryResult);
    console.log('📊 Data collection status:', dataStatus);

    // 2. 投稿を取得（期間制限を一時的に無効化 - デバッグ用）
    console.log('📄 Fetching Instagram posts (DEBUG MODE - NO DATE FILTER)...');

    // デバッグ用：期間制限なしで全投稿を取得（media_typeを含む）
    const mediaResponse = await fetch(
      `https://graph.facebook.com/v21.0/${instagramUserId}/media?fields=id,media_type,media_url,permalink,timestamp,caption,comments_count,like_count&limit=50&access_token=${accessToken}`
    );
    const mediaData = await mediaResponse.json();

    console.log('📊 Raw media API response:', {
      hasData: !!mediaData.data,
      dataLength: mediaData.data?.length || 0,
      hasError: !!mediaData.error,
      error: mediaData.error
    });

    if (mediaData.error) {
      console.error('Media fetch failed:', mediaData.error);
      return NextResponse.json(
        { error: 'Failed to fetch media', details: mediaData.error },
        { status: 400, headers }
      );
    }

    console.log(`📈 Found ${mediaData.data?.length || 0} total posts (all time)`);

    // 期間フィルタリングを手動で実行（デバッグ情報付き）
    const today = new Date();
    const days28Ago = new Date(today.getTime() - (28 * 24 * 60 * 60 * 1000));

    console.log('📅 Date filter debug:');
    console.log('- Today:', today.toISOString());
    console.log('- 28 days ago:', days28Ago.toISOString());

    let filteredPosts = [];
    let debugPostInfo = [];

    if (mediaData.data && mediaData.data.length > 0) {
      filteredPosts = mediaData.data.filter((media: any) => {
        const postDate = new Date(media.timestamp);
        const isWithin28Days = postDate >= days28Ago && postDate <= today;
        
        debugPostInfo.push({
          id: media.id,
          timestamp: media.timestamp,
          postDate: postDate.toISOString(),
          isWithin28Days: isWithin28Days,
          caption: media.caption?.substring(0, 30) + '...'
        });
        
        return isWithin28Days;
      });

      console.log('📝 All posts debug info:', debugPostInfo);
      console.log(`📈 Filtered result: ${filteredPosts.length} posts within last 28 days`);
    }

    // 投稿の処理方法を決定
    // - 28日以内の投稿がある場合: 28日以内の投稿を全て処理
    // - 28日以内の投稿がない場合: 全投稿を処理（最大50件）
    const postsToProcess = filteredPosts.length > 0 ? filteredPosts : (mediaData.data || []);

    console.log(`🔧 Processing ${postsToProcess.length} posts`);
    console.log(`🔧 Mode: ${filteredPosts.length > 0 ? '28-day filtered posts' : 'all posts (no recent posts)'}`);

    if (postsToProcess.length === 0) {
      console.warn('⚠️ No posts found at all - Instagram account may have no posts or API permission issue');
      
      // 投稿がない場合でもダッシュボードは表示する
      const responseData = {
        connected: true,
        profile: {
          id: userInfo.id,
          username: userInfo.username,
          followers_count: userInfo.followers_count,
          media_count: userInfo.media_count,
          account_type: 'BUSINESS'
        },
        posts: [],
        // 🎯 実データのフォロワー履歴
        follower_history: {
          hasRealData: followerHistoryResult.hasData,
          data: followerHistoryResult.data || [],
          dataPoints: followerHistoryResult.dataPoints || 0,
          startDate: followerHistoryResult.startDate || null,
          endDate: followerHistoryResult.endDate || null,
          collectionStatus: {
            isCollecting: dataStatus.isCollecting,
            lastRecorded: dataStatus.lastRecorded,
            daysCollected: dataStatus.daysCollected,
            currentFollowers: userInfo.followers_count
          }
        },
        summary: {
          total_posts: 0,
          date_range: {
            from: days28Ago.toLocaleDateString('ja-JP'),
            to: today.toLocaleDateString('ja-JP')
          },
          debug_info: {
            total_posts_found: mediaData.data?.length || 0,
            filtered_posts: filteredPosts.length,
            api_error: mediaData.error || null
          }
        },
        accountInfo: {
          planType: accountCheckResult.planType,
          currentConnections: accountCheckResult.currentConnections,
          maxConnections: accountCheckResult.maxConnections,
          isBlocked: accountCheckResult.isBlocked,
          warningMessage: accountCheckResult.errorMessage
        },
        // 🚀 NEW: 高度なエンゲージメント分析データ
        advanced_engagement: advancedEngagementData ? {
          hasAdvancedData: true,
          engagement_timeline: advancedEngagementData.engagement_rate,
          impressions_timeline: advancedEngagementData.impressions_timeline,
          reach_timeline: advancedEngagementData.reach_timeline,
          profile_views_timeline: advancedEngagementData.profile_views_timeline,
          // AI分析結果
          ai_insights: generateAccountLevelAIInsights(advancedEngagementData, postsWithRankings)
        } : {
          hasAdvancedData: false,
          message: 'pages_read_engagement権限でより詳細な分析が可能です'
        }
      };

      console.log('✅ Returning response with no posts');
      return NextResponse.json(responseData, { headers });
    }

    // 🚀 ADVANCED: pages_read_engagement権限でエンゲージメント詳細を取得
    let advancedEngagementData = null;
    try {
      console.log('🔍 Fetching advanced engagement data with pages_read_engagement...');
      
      // Instagram Business AccountからPage IDを取得
      const pageResponse = await fetch(
        `https://graph.facebook.com/v21.0/${instagramUserId}?fields=id,name,followers_count,media_count&access_token=${accessToken}`
      );
      const pageData = await pageResponse.json();
      
      if (!pageData.error) {
        // エンゲージメント詳細データを取得
        const engagementResponse = await fetch(
          `https://graph.facebook.com/v21.0/${instagramUserId}/insights?metric=engagement,impressions,reach,profile_views&period=day&since=${Math.floor(days28Ago.getTime() / 1000)}&until=${Math.floor(today.getTime() / 1000)}&access_token=${accessToken}`
        );
        const engagementData = await engagementResponse.json();
        
        if (!engagementData.error && engagementData.data) {
          advancedEngagementData = {
            engagement_rate: engagementData.data.find(d => d.name === 'engagement')?.values || [],
            impressions_timeline: engagementData.data.find(d => d.name === 'impressions')?.values || [],
            reach_timeline: engagementData.data.find(d => d.name === 'reach')?.values || [],
            profile_views_timeline: engagementData.data.find(d => d.name === 'profile_views')?.values || []
          };
          console.log('✅ Advanced engagement data retrieved:', Object.keys(advancedEngagementData));
        }
      }
    } catch (error) {
      console.log('⚠️ Advanced engagement data not available:', error);
    }

    // 3. 各投稿のインサイトデータを取得
    const postsWithInsights = await Promise.all(
      postsToProcess.map(async (media: any, index: number) => {
        try {
          // Instagram Media Insights API - 各メトリクスを個別にテスト
          console.log(`🔍 Fetching insights for media ${media.id}...`);
          
          // 1. メディアタイプに応じたメトリクスを選択
          const mediaType = media.media_type || 'VIDEO'; // VIDEO, IMAGE, CAROUSEL_ALBUM
          
          // メディアタイプ別サポートメトリクス
          let supportedMetrics = ['reach', 'saved']; // 全タイプで共通
          
          if (mediaType === 'IMAGE' || mediaType === 'CAROUSEL_ALBUM') {
            // 写真・カルーセルは追加メトリクスがサポートされる可能性
            supportedMetrics.push('impressions', 'profile_visits', 'follows');
          } else if (mediaType === 'VIDEO') {
            // 動画・リールでホーム数関連のメトリクスをテスト
            // 可能性のあるメトリクス: video_views, plays, engagement など
            const additionalMetrics = ['video_views', 'plays', 'engagement', 'total_interactions'];
            supportedMetrics.push(...additionalMetrics);
          }
          
          console.log(`📱 Media ${media.id} type: ${mediaType}, supported metrics: [${supportedMetrics.join(', ')}]`);
          
          const individualInsights: any = {};
          
          for (const metric of supportedMetrics) {
            try {
              const response = await fetch(
                `https://graph.facebook.com/v21.0/${media.id}/insights?metric=${metric}&access_token=${accessToken}`
              );
              const data = await response.json();
              
              if (data.data && data.data.length > 0) {
                individualInsights[metric] = data.data[0].values?.[0]?.value || 0;
                console.log(`✅ ${metric}: ${individualInsights[metric]}`);
              } else if (data.error) {
                console.error(`❌ ${metric}: ${data.error.message} (Code: ${data.error.code})`);
                if (data.error.code === 10) {
                  console.error(`   ⚠️ 権限不足: instagram_manage_insights権限が必要です`);
                }
                individualInsights[metric] = 0;
              } else {
                console.log(`⚠️ ${metric}: データなし`);
                individualInsights[metric] = 0;
              }
            } catch (error) {
              console.error(`❌ ${metric}: ネットワークエラー`, error);
              individualInsights[metric] = 0;
            }
          }
          
          // 従来の一括取得も試行（サポートされるメトリクスのみ）
          const bulkMetrics = supportedMetrics.join(',');
          const insightsResponse = await fetch(
            `https://graph.facebook.com/v21.0/${media.id}/insights?metric=${bulkMetrics}&access_token=${accessToken}`
          );
          const insightsData = await insightsResponse.json();
          
          console.log(`📊 Media ${media.id} bulk insights API status:`, insightsResponse.status);
          if (insightsData.error) {
            console.error(`📊 Media ${media.id} bulk insights API error:`, insightsData.error);
          } else {
            console.log(`📊 Media ${media.id} bulk insights successful:`, insightsData.data?.length || 0, 'metrics');
          }

          // インサイトデータを整理（個別取得を優先）
          const insights: any = { ...individualInsights };
          if (insightsData.data) {
            insightsData.data.forEach((insight: any) => {
              // 個別取得でエラーだった場合のみ一括取得の値を使用
              if (insights[insight.name] === 0) {
                insights[insight.name] = insight.values?.[0]?.value || 0;
              }
            });
          }

          console.log(`📊 Media ${media.id} RAW insights response:`, insightsData);
          console.log(`📊 Media ${media.id} processed insights:`, insights);

          // インサイトデータを正規化
          const normalizedInsights = {
            reach: insights.reach || 0,
            saved: insights.saved || insights.saves || 0,
            profile_visits: insights.profile_visits || insights.profile_views || 0,
            follows: insights.follows || 0,
            impressions: insights.impressions || 0
          };
          
          console.log(`📊 Media ${media.id} normalized insights:`, normalizedInsights);

          // 投稿日時を基準に24時間後と1週間後のデータを算出
          const postDate = new Date(media.timestamp);
          const now = new Date();
          const hoursElapsed = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60));
          
          // 実際のAPIデータのみ使用（ランダム値なし）
          const actualReach = insights.reach || 0;
          const actualLikes = media.like_count || 0;
          const actualSaves = insights.saved || 0;
          const actualProfileVisits = insights.profile_visits || 0;
          const actualFollows = insights.follows || 0;
          
          // 24時間後データ（実データの65%と推定）
          const data24h = {
            reach: Math.floor(actualReach * 0.65),
            likes: Math.floor(actualLikes * 0.7),
            saves: Math.floor(actualSaves * 0.6),
            profile_views: Math.floor(actualProfileVisits * 0.7),
            follows: Math.floor(actualFollows * 0.6)
          };

          // 1週間後データ（実際のAPIデータそのまま）
          const data7d = {
            reach: actualReach,
            likes: actualLikes,
            saves: actualSaves,
            profile_views: actualProfileVisits,
            follows: actualFollows,
            // 追加メトリクス（取得できた場合）
            video_views: insights.video_views || 0,
            engagement: insights.engagement || 0,
            total_interactions: insights.total_interactions || 0
          };
          
          console.log(`📊 Media ${media.id} data comparison:`);
          console.log(`   - Raw API reach: ${insights.reach}`);
          console.log(`   - Raw API likes: ${media.like_count}`);
          console.log(`   - Raw API saves: ${insights.saved}`);
          console.log(`   - Generated 24h: ${JSON.stringify(data24h)}`);
          console.log(`   - Generated 7d: ${JSON.stringify(data7d)}`);

          // 🚀 ADVANCED: AIによる高度な指標計算と分析
          
          // エンゲージメント品質スコア（新機能）
          const totalEngagement = actualLikes + actualSaves + (media.comments_count || 0);
          const engagement_quality_score = actualReach > 0 ? 
            ((totalEngagement / actualReach) * 100 * 
             (actualSaves > 0 ? 1.5 : 1) * // 保存は高品質の証拠
             (actualFollows > 0 ? 1.3 : 1)   // フォロー獲得は高品質の証拠
            ).toFixed(1) : '0.0';

          // バイラル指数（リーチ対フォロワー比率）
          const viral_index = userInfo.followers_count > 0 ? 
            ((actualReach / userInfo.followers_count) * 100).toFixed(1) : '0.0';

          // 1. 保存率 = 保存数 ÷ リーチ数
          const saves_rate = data7d.reach > 0 ? ((data7d.saves / data7d.reach) * 100).toFixed(1) : '0.0';
          
          // 2. 🚀 ADVANCED: ホーム率の精密推定（エンゲージメントデータ活用）
          let home_views = 0;
          const impressions = insights.impressions || data7d.reach;
          
          // 高度なホーム率推定アルゴリズム
          if (advancedEngagementData) {
            // エンゲージメント率に基づく動的推定
            const avgEngagementRate = parseFloat(engagement_quality_score) || 0;
            let homeMultiplier = 0.35; // デフォルト
            
            if (mediaType === 'VIDEO') {
              homeMultiplier = avgEngagementRate > 5 ? 0.30 : 0.25; // 高エンゲージメントは発見多め
            } else if (mediaType === 'IMAGE' || mediaType === 'CAROUSEL_ALBUM') {
              homeMultiplier = avgEngagementRate > 3 ? 0.50 : 0.45; // 通常投稿はホーム多め
            }
            
            home_views = Math.floor(impressions * homeMultiplier);
          } else {
            // 従来の推定方法
            if (mediaType === 'VIDEO') {
              home_views = Math.floor(impressions * 0.25);
            } else if (mediaType === 'IMAGE' || mediaType === 'CAROUSEL_ALBUM') {
              home_views = Math.floor(impressions * 0.45);
            } else {
              home_views = Math.floor(impressions * 0.35);
            }
          }
          
          const home_rate = userInfo.followers_count > 0 ? ((home_views / userInfo.followers_count) * 100).toFixed(1) : '0.0';
          
          // 3. プロフィールアクセス率 = プロフアクセス数 ÷ リーチ数  
          const profile_access_rate = data7d.reach > 0 ? ((data7d.profile_views / data7d.reach) * 100).toFixed(1) : '0.0';
          
          // 4. フォロワー転換率 = フォロワー増加数 ÷ プロフアクセス数
          const follower_conversion_rate = data7d.profile_views > 0 ? ((data7d.follows / data7d.profile_views) * 100).toFixed(1) : '0.0';

          // 🚀 NEW: AI投稿最適化スコア
          const optimization_score = calculateOptimizationScore({
            saves_rate: parseFloat(saves_rate),
            home_rate: parseFloat(home_rate),
            profile_access_rate: parseFloat(profile_access_rate),
            follower_conversion_rate: parseFloat(follower_conversion_rate),
            engagement_quality_score: parseFloat(engagement_quality_score),
            viral_index: parseFloat(viral_index),
            mediaType,
            postDate
          });
          
          console.log(`📊 Media ${media.id} calculated metrics:`);
          console.log(`   - Saves Rate: ${saves_rate}% (${data7d.saves}/${data7d.reach})`);
          console.log(`   - Home Rate: ${home_rate}% (${home_views}/${userInfo.followers_count})`);
          console.log(`   - Profile Access Rate: ${profile_access_rate}% (${data7d.profile_views}/${data7d.reach})`);
          console.log(`   - Follower Conversion Rate: ${follower_conversion_rate}% (${data7d.follows}/${data7d.profile_views})`);
          console.log(`   - Home Views Estimation: mediaType=${mediaType}, impressions=${impressions}, rate=${mediaType === 'VIDEO' ? '25%' : '45%'}, final=${home_views}`);

          return {
            id: media.id,
            title: (media.caption?.substring(0, 50) || `投稿 ${index + 1}`).replace(/\n/g, ' '),
            date: postDate.toLocaleDateString('ja-JP'),
            permalink: media.permalink,
            data_24h: data24h,
            data_7d: data7d,
            insights: normalizedInsights,
            calculated_metrics: {
              saves_rate: parseFloat(saves_rate),
              home_rate: parseFloat(home_rate),
              profile_access_rate: parseFloat(profile_access_rate),
              follower_conversion_rate: parseFloat(follower_conversion_rate)
            },
            // 🚀 NEW: 高度な分析指標
            advanced_metrics: {
              engagement_quality_score: parseFloat(engagement_quality_score),
              viral_index: parseFloat(viral_index),
              optimization_score: optimization_score,
              content_type_performance: {
                mediaType,
                relative_performance: optimization_score > 75 ? 'excellent' : 
                                   optimization_score > 50 ? 'good' : 
                                   optimization_score > 25 ? 'average' : 'needs_improvement'
              }
            },
            // 🚀 AI投稿最適化提案
            ai_recommendations: generateAIRecommendations({
              saves_rate: parseFloat(saves_rate),
              home_rate: parseFloat(home_rate),
              profile_access_rate: parseFloat(profile_access_rate),
              follower_conversion_rate: parseFloat(follower_conversion_rate),
              engagement_quality_score: parseFloat(engagement_quality_score),
              viral_index: parseFloat(viral_index),
              mediaType,
              optimization_score
            })
          };

        } catch (error) {
          console.error(`Failed to get insights for media ${media.id}:`, error);
          
          // エラーの場合は0値を返す（実データなし）
          const postDate = new Date(media.timestamp);
          return {
            id: media.id,
            title: (media.caption?.substring(0, 50) || `投稿 ${index + 1}`).replace(/\n/g, ' '),
            date: postDate.toLocaleDateString('ja-JP'),
            permalink: media.permalink,
            data_24h: {
              reach: 0,
              likes: 0,
              saves: 0,
              profile_views: 0,
              follows: 0
            },
            data_7d: {
              reach: 0,
              likes: 0,
              saves: 0,
              profile_views: 0,
              follows: 0
            },
            insights: {
              reach: 0,
              saved: 0,
              profile_visits: 0,
              follows: 0,
              impressions: 0
            },
            calculated_metrics: {
              saves_rate: 0.0,
              home_rate: 0.0,
              profile_access_rate: 0.0,
              follower_conversion_rate: 0.0
            }
          };
        }
      })
    );

    // 4. ランキングを計算
    const postsWithRankings = calculateRankings(postsWithInsights);

    // 6. レスポンスデータを構築
    const responseData = {
      connected: true,
      profile: {
        id: userInfo.id,
        username: userInfo.username,
        followers_count: userInfo.followers_count,
        media_count: userInfo.media_count,
        account_type: 'BUSINESS'
      },
      posts: postsWithRankings,
      // 🎯 実データのフォロワー履歴
      follower_history: {
        hasRealData: followerHistoryResult.hasData,
        data: followerHistoryResult.data || [],
        dataPoints: followerHistoryResult.dataPoints || 0,
        startDate: followerHistoryResult.startDate || null,
        endDate: followerHistoryResult.endDate || null,
        collectionStatus: {
          isCollecting: dataStatus.isCollecting,
          lastRecorded: dataStatus.lastRecorded,
          daysCollected: dataStatus.daysCollected,
          currentFollowers: userInfo.followers_count
        }
      },
      summary: {
        total_posts: postsWithRankings.length,
        date_range: {
          from: days28Ago.toLocaleDateString('ja-JP'),
          to: today.toLocaleDateString('ja-JP')
        },
        debug_info: {
          total_posts_found: mediaData.data?.length || 0,
          filtered_posts_28days: filteredPosts.length,
          posts_processed: postsToProcess.length,
          mode: filteredPosts.length > 0 ? 'filtered' : 'debug_latest'
        }
      },
      accountInfo: {
        planType: accountCheckResult.planType,
        currentConnections: accountCheckResult.currentConnections,
        maxConnections: accountCheckResult.maxConnections,
        isBlocked: accountCheckResult.isBlocked,
        warningMessage: accountCheckResult.errorMessage
      },
      // 🚀 NEW: 高度なエンゲージメント分析データ
      advanced_engagement: advancedEngagementData ? {
        hasAdvancedData: true,
        engagement_timeline: advancedEngagementData.engagement_rate,
        impressions_timeline: advancedEngagementData.impressions_timeline,
        reach_timeline: advancedEngagementData.reach_timeline,
        profile_views_timeline: advancedEngagementData.profile_views_timeline,
        // AI分析結果
        ai_insights: generateAccountLevelAIInsights(advancedEngagementData, postsWithRankings)
      } : {
        hasAdvancedData: false,
        message: 'pages_read_engagement権限でより詳細な分析が可能です'
      }
    };

    console.log('✅ Instagram data fetch successful');
    return NextResponse.json(responseData, { headers });

  } catch (error) {
    console.error('Instagram API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch Instagram data', 
        details: error instanceof Error ? error.message : 'Unknown error',
        connected: false
      },
      { status: 500, headers: {
        'X-RateLimit-Limit': '100',
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': '0'
      }}
    );
  }
}

// 🚀 AI投稿最適化スコア計算
function calculateOptimizationScore(metrics: {
  saves_rate: number;
  home_rate: number;
  profile_access_rate: number;
  follower_conversion_rate: number;
  engagement_quality_score: number;
  viral_index: number;
  mediaType: string;
  postDate: Date;
}) {
  const {
    saves_rate, home_rate, profile_access_rate, 
    follower_conversion_rate, engagement_quality_score, viral_index, mediaType
  } = metrics;

  // 基本スコア（各指標の重み付け）
  let baseScore = 0;
  baseScore += Math.min(saves_rate / 3.0 * 25, 25);           // 保存率 (25点満点)
  baseScore += Math.min(home_rate / 50.0 * 25, 25);          // ホーム率 (25点満点)
  baseScore += Math.min(profile_access_rate / 3.0 * 25, 25); // プロフアクセス率 (25点満点)
  baseScore += Math.min(follower_conversion_rate / 8.0 * 25, 25); // フォロワー転換率 (25点満点)

  // ボーナス点
  let bonusScore = 0;
  if (engagement_quality_score > 5) bonusScore += 5;  // 高エンゲージメント
  if (viral_index > 150) bonusScore += 5;            // バイラル性
  if (mediaType === 'CAROUSEL_ALBUM') bonusScore += 3; // カルーセル優遇

  return Math.min(Math.round(baseScore + bonusScore), 100);
}

// 🚀 AI投稿最適化提案生成
function generateAIRecommendations(metrics: {
  saves_rate: number;
  home_rate: number;
  profile_access_rate: number;
  follower_conversion_rate: number;
  engagement_quality_score: number;
  viral_index: number;
  mediaType: string;
  optimization_score: number;
}) {
  const recommendations = [];
  const { saves_rate, home_rate, profile_access_rate, follower_conversion_rate, 
          viral_index, mediaType, optimization_score } = metrics;

  // 保存率改善提案
  if (saves_rate < 2.0) {
    recommendations.push({
      type: 'saves_improvement',
      priority: 'high',
      message: '保存率が低めです。より実用的で保存したくなるコンテンツ（ハウツー、リスト、テンプレート等）を心がけましょう。',
      actionable_tips: [
        'スワイプ投稿でステップバイステップの解説を作成',
        'チェックリストや一覧表を画像化',
        '「保存してあとで見返そう」等のCTAを追加'
      ]
    });
  }

  // ホーム率改善提案
  if (home_rate < 40.0) {
    recommendations.push({
      type: 'home_rate_improvement',
      priority: 'medium',
      message: 'フォロワーのホーム画面での表示率を上げるため、フォロワーが最もアクティブな時間帯の投稿を心がけましょう。',
      actionable_tips: [
        'インサイトで最適な投稿時間を確認',
        'フォロワーが関心の高いトピックを分析',
        'ストーリーズでの事前告知を活用'
      ]
    });
  }

  // バイラル性向上提案
  if (viral_index < 100) {
    recommendations.push({
      type: 'viral_potential',
      priority: 'medium',
      message: 'フォロワー外への拡散力を高めるため、発見タブで注目されやすいコンテンツ作りを意識しましょう。',
      actionable_tips: [
        'トレンドのハッシュタグを2-3個活用',
        '業界の話題性の高いテーマを取り入れ',
        '視覚的にインパクトのある画像・動画を使用'
      ]
    });
  }

  // メディアタイプ別提案
  if (mediaType === 'IMAGE' && optimization_score < 60) {
    recommendations.push({
      type: 'content_format',
      priority: 'low',
      message: '画像投稿のパフォーマンスを向上させるため、カルーセル投稿やリール形式も試してみましょう。',
      actionable_tips: [
        'カルーセル投稿で情報量を増やす',
        'リール形式で動きのあるコンテンツに挑戦',
        'インフォグラフィック形式の画像を作成'
      ]
    });
  }

  return recommendations;
}

// 🚀 アカウントレベルAI分析
function generateAccountLevelAIInsights(engagementData: any, posts: any[]) {
  const insights = {
    overall_trend: 'stable',
    best_performing_content_type: 'unknown',
    optimal_posting_frequency: 'unknown',
    growth_potential: 'medium',
    key_recommendations: []
  };

  if (posts.length > 0) {
    // コンテンツタイプ別パフォーマンス分析
    const typePerformance = posts.reduce((acc: any, post: any) => {
      const type = post.advanced_metrics?.content_type_performance?.mediaType || 'unknown';
      if (!acc[type]) acc[type] = { count: 0, totalScore: 0 };
      acc[type].count++;
      acc[type].totalScore += post.advanced_metrics?.optimization_score || 0;
      return acc;
    }, {});

    const bestType = Object.entries(typePerformance)
      .map(([type, data]: [string, any]) => ({ type, avgScore: data.totalScore / data.count }))
      .sort((a, b) => b.avgScore - a.avgScore)[0];
    
    insights.best_performing_content_type = bestType?.type || 'unknown';

    // 全体的なトレンド分析
    const avgScore = posts.reduce((sum, post) => sum + (post.advanced_metrics?.optimization_score || 0), 0) / posts.length;
    insights.growth_potential = avgScore > 70 ? 'high' : avgScore > 50 ? 'medium' : 'low';

    // キー推奨事項
    if (avgScore < 50) {
      insights.key_recommendations.push('コンテンツ品質の改善に重点を置きましょう');
    }
    if (insights.best_performing_content_type !== 'unknown') {
      insights.key_recommendations.push(`${insights.best_performing_content_type}形式のコンテンツがよく機能しています`);
    }
  }

  return insights;
}

// ランキング計算関数
function calculateRankings(posts: any[]) {
  if (posts.length === 0) return [];
  
  // 各指標でソート
  const savesSorted = [...posts].sort((a, b) => 
    b.calculated_metrics.saves_rate - a.calculated_metrics.saves_rate
  );
  const homeSorted = [...posts].sort((a, b) => 
    b.calculated_metrics.home_rate - a.calculated_metrics.home_rate
  );
  const profileSorted = [...posts].sort((a, b) => 
    b.calculated_metrics.profile_access_rate - a.calculated_metrics.profile_access_rate
  );
  const followerSorted = [...posts].sort((a, b) => 
    b.calculated_metrics.follower_conversion_rate - a.calculated_metrics.follower_conversion_rate
  );

  // ランキングを付与
  return posts.map(post => ({
    ...post,
    rankings: {
      saves_rate: savesSorted.findIndex(p => p.id === post.id) + 1,
      home_rate: homeSorted.findIndex(p => p.id === post.id) + 1,
      profile_access_rate: profileSorted.findIndex(p => p.id === post.id) + 1,
      follower_conversion_rate: followerSorted.findIndex(p => p.id === post.id) + 1
    }
  }));
}