// Cloudflare Pages Function - Remove.bg API 代理
// 路径: /functions/api/remove-bg.js

export async function onRequestPost(context) {
  const { request, env } = context;
  
  try {
    // 获取上传的图片文件
    const formData = await request.formData();
    const imageFile = formData.get('image_file');
    
    if (!imageFile) {
      return new Response(JSON.stringify({ error: 'No image file provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 从环境变量获取 API Key
    const apiKey = env.REMOVE_BG_API_KEY;
    
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 构建 Remove.bg API 请求
    const removeBgFormData = new FormData();
    removeBgFormData.append('image_file', imageFile);
    removeBgFormData.append('size', 'auto');

    // 调用 Remove.bg API
    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
      },
      body: removeBgFormData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ errors: [{ title: 'Unknown error' }] }));
      return new Response(JSON.stringify({ 
        error: errorData.errors?.[0]?.title || 'Remove.bg API error' 
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 返回处理后的图片
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    
    return new Response(arrayBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Error processing image:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// 处理 OPTIONS 请求（CORS 预检）
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
