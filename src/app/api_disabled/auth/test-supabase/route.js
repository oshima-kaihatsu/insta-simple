import { supabaseAdmin } from '../../../lib/supabase';

export async function GET() {
  try {
    // 簡単なテストクエリ
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('count(*)', { count: 'exact' });

    if (error) {
      return Response.json({ 
        success: false, 
        error: error.message 
      }, { status: 500 });
    }

    return Response.json({ 
      success: true, 
      message: 'Supabase connection successful',
      data 
    });

  } catch (error) {
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}