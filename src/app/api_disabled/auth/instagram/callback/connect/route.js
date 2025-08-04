export async function GET() {
    const clientId = process.env.INSTAGRAM_CLIENT_ID;
    const redirectUri = `${process.env.NEXTAUTH_URL}/api/instagram/callback`;
    
    const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user_profile,user_media&response_type=code`;
    
    console.log('Redirecting to Instagram auth:', authUrl);
    return Response.redirect(authUrl);
  }