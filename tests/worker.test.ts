import { test } from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/index';
function fixture() {
  const storage = new Map<string, string>();
  let messages: any[] = [];
  const env = { AI: { run: async (_model: string, input: any) => { messages = structuredClone(input.messages); return { response: 'Next question' }; } },
    CONVERSATIONS: { get: async (key: string) => storage.has(key) ? JSON.parse(storage.get(key)!) : null,
      put: async (key: string, value: string) => { storage.set(key, value); }, delete: async (key: string) => { storage.delete(key); } } };
  const request = (path: string, body: any) => worker.fetch(new Request('https://test.local' + path, { method: 'POST', body: JSON.stringify(body) }), env as any);
  return { request, storage, messages: () => messages, env };
}
test('long conversations retain system instructions and bounded context', async () => {
  const f = fixture();
  for (let i = 0; i < 15; i++) assert.equal((await f.request('/api/chat', { message: 'Answer', sessionId: 'test-session' })).status, 200);
  assert.equal(f.messages()[0].role, 'system');
  assert.match(f.messages()[0].content, /technical interviewer/);
  assert.ok(f.messages().length <= 20);
  assert.equal((await f.request('/api/reset', { sessionId: 'test-session' })).status, 200);
  assert.equal(f.storage.size, 0);
});
test('rejects malformed payloads before calling AI', async () => {
  const f = fixture();
  assert.equal((await f.request('/api/chat', { message: {}, sessionId: 'ok' })).status, 400);
  assert.equal((await f.request('/api/chat', { message: 'ok', sessionId: '../bad' })).status, 400);
  assert.equal((await f.request('/api/reset', {})).status, 400);
  assert.equal((await f.request('/api/chat', null)).status, 400);
  assert.equal((await f.request('/api/reset', null)).status, 400);
  assert.equal((await worker.fetch(new Request('https://test.local/api/chat', { method: 'POST', body: '{' }), f.env as any)).status, 400);
});
