/**
 * @api {get} /auth Check Authentication
 */

export async function onRequestGet(context) {
    const { request, env } = context;
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
    };

    // 从 cookie 中获取 token
    const cookieHeader = request.headers.get('Cookie') || '';
    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        if (key && value) {
            acc[key] = value;
        }
        return acc;
    }, {});

    const token = cookies.auth_token;

    if (token) {
        // 简单的 token 验证（实际应用中应该验证 token 的有效性）
        // 这里我们只检查 token 是否存在且格式正确
        if (token.length >= 16) {
            return Response.json(
                { authenticated: true },
                {
                    headers: corsHeaders,
                    status: 200
                }
            );
        }
    }

    return Response.json(
        { authenticated: false },
        {
            headers: corsHeaders,
            status: 401
        }
    );
}

export async function onRequestOptions(context) {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Max-Age': '86400',
        },
    });
}

