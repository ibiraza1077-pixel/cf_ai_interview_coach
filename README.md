# AI Interview Coach

A portfolio project by Ibrahim, a final-year Computer Science student seeking internship opportunities. This project explores AI service integration, serverless APIs and conversation state.

A mock technical interview application with a React/TypeScript frontend and a Cloudflare Worker using Workers AI. Conversation context is stored in Workers KV with a 24-hour expiry.

## Architecture

- `frontend/src/App.tsx`: interview UI, messages and per-interview session IDs.
- `src/index.ts`: health, chat and reset routes; the interviewer prompt; bounded conversation history.
- `wrangler.toml`: Worker entry point and AI/KV bindings.
- `tests/worker.test.ts`: regression checks with mocked AI and KV, requiring no credentials or paid inference.

The worker keeps the system prompt when trimming long conversations. Requests are validated before using the AI binding. Session IDs are generated with `crypto.randomUUID()` in the browser.

## Local setup

Use Node.js 22.12+ and the repository-local Wrangler CLI.

```sh
npm ci
npm --prefix frontend ci
cp frontend/.env.example frontend/.env
npm run build
npm run dev
```

In another terminal, run `npm --prefix frontend run dev` and open http://localhost:5173. The Worker defaults to http://localhost:8787.

Live AI inference requires a Cloudflare account, access to the configured Workers AI model and authentication (`npx wrangler login`). It can consume account quota even during local development. The automated tests use mocks instead.

For your own deployment, create KV namespaces with `npx wrangler kv namespace create CONVERSATIONS` and the `--preview` variant, then use their IDs in `wrangler.toml`. The existing IDs identify the original project's namespaces; IDs are configuration, not credentials.

## Checks

```sh
npm test
npm run type-check
npm --prefix frontend run build
npx wrangler deploy --dry-run
```

The dry run builds the Worker without publishing it. CI runs tests, type checking and the frontend build. Wrangler was upgraded following [Cloudflare's v3-to-v4 migration guide](https://developers.cloudflare.com/workers/wrangler/migration/update-v3-to-v4/).

## API

| Method | Route | Request |
| --- | --- | --- |
| GET | `/health` | No body; process health only |
| POST | `/api/chat` | `{ "message": "My answer", "sessionId": "random-session-id" }` |
| POST | `/api/reset` | `{ "sessionId": "random-session-id" }` |

Chat returns `response` and `sessionId`. History expires 24 hours after its last update. The model configured in source is `@cf/meta/llama-3.3-70b-instruct-fp8-fast`; account access and model availability must be checked when deploying.

## Deploy

Run `npm run deploy` from the root when ready to publish. It builds the frontend and deploys it together with the API on the same Worker. The production UI uses its own origin by default, while Vite development uses `http://localhost:8787`. Leave `VITE_API_URL` unset for the combined deployment; set it only when deliberately hosting the frontend separately. Wrangler routes `/api/*` and `/health` to the Worker and serves the UI from `frontend/dist`.

GitHub Actions deploys changes to `main` after running tests and the build. Store a limited Cloudflare deployment token as the repository Actions secret `CLOUDFLARE_API_TOKEN`; `.github/workflows/deploy.yml` identifies the original account. Forks must update the account and KV namespace IDs before deployment. The workflow can also be run manually. It never deploys pull requests. Keep the Workers plan Free to cap costs at £0: the free AI allowance is 10,000 neurons per day and requests fail after the allowance is exhausted. See [Cloudflare's quota and pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/).

## Limitations

This is an interview-practice portfolio project, not a validated hiring assessment. There is no evidence supporting usage counts or a job-success percentage. The UI avoids those claims.

Sessions are anonymous; anyone who knows a session ID can use/reset that conversation. KV is eventually consistent and concurrent updates can overwrite one another. Authentication, per-user quotas, rate limits, durable concurrency control and full deployment monitoring are not implemented. Do not enter confidential interview or employer information.

`PROMPTS.md` describes the model instructions and their boundaries. Generated dependencies, frontend build output, local KV state and environment files are excluded from Git.
