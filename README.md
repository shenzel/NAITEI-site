# NAITEI.site

## How to dev

```bash
npm install
echo > .env.local
```
以下は`.env.local`に設定する環境変数の例です。

```env
KV_URL=""
KV_REST_API_URL=""
KV_REST_API_TOKEN=""
KV_REST_API_READ_ONLY_TOKEN=""
REDIS_URL=""
GITHUB_ID=""
GITHUB_SECRET=""
NEXTAUTH_SECRET=""
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GEMINI_API_KEY=""
```

```bash
npm run dev
```
access to http://localhost:3000/

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).