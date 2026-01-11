/**
 * @api {post} /login Login
 */

export async function onRequestPost(context) {
    const { request, env } = context;
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Credentials': 'true',
    };

    try {
        const { username, password } = await request.json();
        
        // 从环境变量获取 USER 和 PASSWORD
        const validUser = env.USER;
        const validPassword = env.PASSWORD;

        // 检查环境变量是否设置
        if (!validUser || !validPassword) {
            return Response.json(
                { message: '服务器配置错误：未设置登录凭据。' },
                {
                    headers: corsHeaders,
                    status: 500
                }
            );
        }

        // 验证用户名和密码
        if (username === validUser && password === validPassword) {
            // 生成简单的 session token
            const token = generateToken();
            const expires = new Date();
            expires.setTime(expires.getTime() + 7 * 24 * 60 * 60 * 1000); // 7天过期

            return Response.json(
                { success: true, message: '登录成功' },
                {
                    headers: {
                        ...corsHeaders,
                        'Set-Cookie': `auth_token=${token}; Path=/; HttpOnly; SameSite=Lax; Expires=${expires.toUTCString()}`
                    },
                    status: 200
                }
            );
        } else {
            return Response.json(
                { success: false, message: '用户名或密码错误' },
                {
                    headers: corsHeaders,
                    status: 401
                }
            );
        }
    } catch (e) {
        return Response.json(
            { success: false, message: e.message },
            {
                headers: corsHeaders,
                status: 500
            }
        );
    }
}

export async function onRequestOptions(context) {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Max-Age': '86400',
        },
    });
}

function generateToken() {
    // 生成一个简单的 token（实际应用中应该使用更安全的方法）
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < 32; i++) {
        token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
}

