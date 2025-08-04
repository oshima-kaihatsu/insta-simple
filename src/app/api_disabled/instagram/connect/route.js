export async function GET(request) {
  const clientId = process.env.INSTAGRAM_CLIENT_ID;
  // 重要：ngrok URLを使用
  const redirectUri = `${process.env.NEXTAUTH_URL}/api/instagram/callback`;
  
  console.log('=== Instagram Graph API Connect ===');
  console.log('Client ID:', clientId);
  console.log('Redirect URI:', redirectUri);
  
  const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=instagram_basic,pages_show_list,instagram_manage_insights&response_type=code`;
  
  return Response.redirect(authUrl);
}