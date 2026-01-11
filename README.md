## 介绍

一个使用 Cloudflare Pages 创建的 URL 缩短器

*Demo* : [https://short-3ud.pages.dev/](https://short-3ud.pages.dev/)


### 利用Tencent EdgeOne Pages 部署
> 未完成，Tencent EdgeOne的KV 存储还在申请中

一键部署：

[![Use EdgeOne Pages to deploy](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://edgeone.ai/pages/new?repository-url=https://github.com/x-dr/short)


### 利用Cloudflare pages部署


1. fork本项目
2. 登录到[Cloudflare](https://dash.cloudflare.com/)控制台.
3. 在帐户主页中，选择`pages`> ` Create a project` > `Connect to Git`
4. 选择你创建的项目存储库，在`Set up builds and deployments`部分中，全部默认即可。
5. 点击`Save and Deploy`，稍等片刻，你的网站就部署好了。
6. 创建D1数据库参考[这里](https://github.com/x-dr/telegraph-Image/blob/main/docs/manage.md)
7. 执行sql命令创建表（在控制台输入框粘贴下面语句执行即可）

```sql
DROP TABLE IF EXISTS links;
CREATE TABLE IF NOT EXISTS links (
  `id` integer PRIMARY KEY NOT NULL,
  `url` text,
  `slug` text,
  `ua` text,
  `ip` text,
  `status` int,
  `create_time` DATE
);
DROP TABLE IF EXISTS logs;
CREATE TABLE IF NOT EXISTS logs (
  `id` integer PRIMARY KEY NOT NULL,
  `url` text ,
  `slug` text,
  `referer` text,
  `ua` text ,
  `ip` text ,
  `create_time` DATE
);

```
8. 选择部署完成short项目，前往后台依次点击`设置`->`函数`->`D1 数据库绑定`->`编辑绑定`->变量名称填写：`DB` 命名空间 `选择你提前创建好的D1` 数据库绑定

9. （可选）配置登录功能：在`设置`->`环境变量`中添加以下变量：
   - `USER`: 登录用户名
   - `PASSWORD`: 登录密码
   
   如果不配置这两个环境变量，项目可以直接使用，无需登录。配置后，访问链接生成页面需要先登录。

10. 重新部署项目，完成。


### 功能特性

- ✅ **URL 缩短**：将长链接转换为短链接
- ✅ **自定义 Slug**：支持自定义短链接标识符（2-10 个字符）
- ✅ **访问日志**：记录短链接的访问信息（IP、User-Agent、Referer 等）
- ✅ **可选登录保护**：通过环境变量配置用户名和密码，保护链接生成功能
- ✅ **QR Code 生成**：生成短链接后自动生成对应的二维码图片
- ✅ **响应式设计**：适配桌面和移动设备

### 功能说明

#### 登录功能（可选）

项目支持可选的登录保护功能：

- **未配置环境变量**：项目可以直接使用，无需登录即可生成短链接
- **配置环境变量**：在 Cloudflare Pages 的环境变量中设置 `USER` 和 `PASSWORD` 后，访问链接生成页面需要先登录

配置方法：
1. 进入 Cloudflare Pages 项目设置
2. 选择 `设置` -> `环境变量`
3. 添加变量：
   - 变量名：`USER`，值：你的用户名
   - 变量名：`PASSWORD`，值：你的密码
4. 重新部署项目

#### QR Code 功能

生成短链接后，系统会自动生成对应的二维码图片，方便用户扫描访问。二维码会显示在短链接输入框下方。

### API

#### 短链生成

```bash
# POST /create
# 如果配置了登录，需要在请求中包含有效的认证 cookie
curl -X POST -H "Content-Type: application/json" -d '{"url":"https://131213.xyz"}' https://d.131213.xyz/create

# 指定slug
curl -X POST -H "Content-Type: application/json" -d '{"url":"https://131213.xyz","slug":"scxs"}' https://d.131213.xyz/create
```

> response:

```json
{
  "slug": "<slug>",
  "link": "http://d.131213.xyz/<slug>"
}
```

#### 登录 API（仅当配置了环境变量时可用）

```bash
# POST /login
curl -X POST -H "Content-Type: application/json" \
  -d '{"username":"your_username","password":"your_password"}' \
  https://d.131213.xyz/login \
  -c cookies.txt

# GET /auth - 检查登录状态
curl -X GET https://d.131213.xyz/auth \
  -b cookies.txt
```

### 更新日志

#### v2.0.0

**新增功能：**
- ✨ 添加可选的登录保护功能（通过环境变量 `USER` 和 `PASSWORD` 配置）
- ✨ 添加 QR Code 自动生成功能，生成短链接后自动显示二维码
- ✨ 优化用户体验，支持回车键登录

**技术改进：**
- 🔧 登录功能为可选，未配置环境变量时可直接使用
- 🔧 改进前端界面，添加登录表单和 QR Code 显示区域
- 🔧 使用 cookie 进行会话管理（7 天有效期）



