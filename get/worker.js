// get.boson.chat — the Boson installer.
//
//   curl -fsSL https://get.boson.chat | sudo sh
//
// Command-line clients (curl, wget, fetch, …) get boson-chat/stack's
// install.sh as text; browsers get a page showing that command. A browser
// can still see the script at /install.sh (or ?raw).

export const SCRIPT_URL = 'https://raw.githubusercontent.com/boson-chat/stack/main/install.sh';
const DOCS_URL = 'https://boson.chat/self-host';
const CMD = 'curl -fsSL https://get.boson.chat | sudo sh';

const CLI_UA = /^(curl|wget|fetch|libfetch|httpie|aria2|powershell|python-|go-http-client|okhttp|axios|node|undici|xh)\b/i;

// isScriptRequest: true unless this looks like a browser asking for a page.
export function isScriptRequest(req) {
  const url = new URL(req.url);
  if (url.pathname === '/install.sh' || url.searchParams.has('raw')) return true;
  const ua = req.headers.get('user-agent') || '';
  if (CLI_UA.test(ua)) return true;
  const accept = req.headers.get('accept') || '';
  return !accept.includes('text/html');
}

async function script(req, fetchFn) {
  const res = await fetchFn(SCRIPT_URL, { cf: { cacheTtl: 300, cacheEverything: true } });
  if (!res.ok) {
    return new Response(`echo "get.boson.chat: couldn't fetch install.sh (${res.status}); see ${DOCS_URL}" >&2; exit 1\n`, {
      status: 502, headers: { 'content-type': 'text/x-shellscript; charset=utf-8', 'cache-control': 'no-store' },
    });
  }
  return new Response(req.method === 'HEAD' ? null : res.body, {
    headers: {
      'content-type': 'text/x-shellscript; charset=utf-8',
      'cache-control': 'public, max-age=300',
      'x-content-type-options': 'nosniff',
    },
  });
}

function page() {
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Install Boson</title>
<meta name="description" content="Install a self-hosted Boson server with one command.">
<style>
:root{color-scheme:dark;--bg:#070709;--fg:#e8e8ec;--muted:#9a9aa6;--box:#15151b;--border:#2a2a33;--accent:#f08a24}
*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;background:var(--bg);color:var(--fg);font:16px/1.55 Inter,system-ui,sans-serif;padding:24px 16px}
main{max-width:640px;width:100%}h1{font:600 28px/1.2 "JetBrains Mono",ui-monospace,monospace;margin:0 0 8px}
p{color:var(--muted);margin:0 0 20px}a{color:var(--accent)}
.cmd{display:flex;gap:8px;align-items:center;background:var(--box);border:1px solid var(--border);border-radius:8px;padding:12px 12px 12px 16px;overflow-x:auto}
code{font:14px/1.4 "JetBrains Mono",ui-monospace,monospace;white-space:nowrap;flex:1}
button{font:500 13px Inter,system-ui,sans-serif;background:var(--accent);color:#000;border:0;border-radius:6px;padding:8px 12px;cursor:pointer;flex:none}
ol{color:var(--muted);padding-left:20px}li{margin:6px 0}
</style></head><body><main>
<h1>Install Boson</h1>
<p>Chat, voice and video for your own community, self-hosted: a new server, or Boson added to the IRC server you already run. On a Linux server, run:</p>
<div class="cmd"><code id="c">${CMD}</code><button id="b" type="button">Copy</button></div>
<ol>
<li>It checks the server, installs Docker if needed, and starts the setup wizard.</li>
<li>Open the address it prints and enter the one-time code.</li>
<li>The wizard sets up your domain, certificates, admin account and features.</li>
</ol>
<p><a href="/install.sh">View the script</a> · <a href="${DOCS_URL}">Setup guide</a> · <a href="https://boson.chat">boson.chat</a></p>
</main><script>
document.getElementById('b').onclick=async()=>{try{await navigator.clipboard.writeText(document.getElementById('c').textContent);document.getElementById('b').textContent='Copied'}catch{}};
</script></body></html>`;
  return new Response(html, {
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=300', vary: 'User-Agent, Accept' },
  });
}

export default {
  async fetch(req, _env, _ctx, fetchFn = fetch) {
    if (req.method !== 'GET' && req.method !== 'HEAD') return new Response('method not allowed\n', { status: 405 });
    if (isScriptRequest(req)) return script(req, fetchFn);
    return page();
  },
};
