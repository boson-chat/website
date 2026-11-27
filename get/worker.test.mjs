// node --test get/worker.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import worker, { isScriptRequest, SCRIPT_URL } from './worker.js';

const req = (ua, accept = '*/*', path = '/') =>
  new Request('https://get.boson.chat' + path, { headers: { 'user-agent': ua, accept } });
const fakeFetch = async (url) => { assert.equal(url, SCRIPT_URL); return new Response('#!/bin/sh\necho hi\n'); };

test('command-line clients get the script', () => {
  for (const ua of ['curl/8.5.0', 'Wget/1.21.4', 'fetch libfetch/2.0', 'HTTPie/3.2', 'python-requests/2.31', 'Go-http-client/2.0', ''])
    assert.ok(isScriptRequest(req(ua)), ua);
});
test('browsers get the page', () => {
  const ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 Safari/605.1.15';
  assert.equal(isScriptRequest(req(ua, 'text/html,application/xhtml+xml,*/*;q=0.8')), false);
  assert.ok(isScriptRequest(req(ua, 'text/html', '/install.sh')));
  assert.ok(isScriptRequest(req(ua, 'text/html', '/?raw')));
});
test('responses', async () => {
  const s = await worker.fetch(req('curl/8.5.0'), {}, {}, fakeFetch);
  assert.match(s.headers.get('content-type'), /shellscript/);
  assert.equal(await s.text(), '#!/bin/sh\necho hi\n');
  const p = await worker.fetch(req('Mozilla/5.0', 'text/html'), {}, {}, fakeFetch);
  assert.match(p.headers.get('content-type'), /text\/html/);
  assert.match(await p.text(), /curl -fsSL https:\/\/get\.boson\.chat \| sudo sh/);
  const bad = await worker.fetch(req('curl/8'), {}, {}, async () => new Response('', { status: 404 }));
  assert.equal(bad.status, 502);
  assert.equal((await worker.fetch(new Request('https://get.boson.chat/', { method: 'POST' }))).status, 405);
});
