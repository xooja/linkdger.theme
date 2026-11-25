#!/usr/bin/env node
// LINKDGER theme tool: make your shop's website theme on your computer.
//
//   npx github:xooja/linkdger.theme login     allow this computer on linkdger.com
//   npx github:xooja/linkdger.theme dev       a dev copy that updates as you save
//   npx github:xooja/linkdger.theme push      a new version (the app's check, then Make live)
//
// Node 18 or newer, nothing else to install. The guide: https://linkdger.com/themes/guide#cli
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import zlib from 'node:zlib';
import readline from 'node:readline/promises';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const VERSION = '1.0.2';
const API = (process.env.LINKDGER_API || 'https://linkdger.com/api/theme-cli').replace(/\/+$/, '');
const CONFIG_DIR = process.env.LINKDGER_CONFIG_DIR || path.join(os.homedir(), '.linkdger');
const CONFIG = path.join(CONFIG_DIR, 'theme-tool.json');
const UA = `linkdger-theme/${VERSION} (node ${process.versions.node}; ${process.platform})`;
const STARTER = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'linkdger-orbit');
const RUN = 'npx github:xooja/linkdger.theme';

// The kinds of files a theme can have (the server's check takes the same); anything else stays on your computer.
const KINDS = new Set(['html', 'htm', 'css', 'json', 'png', 'jpg', 'jpeg', 'gif', 'webp', 'avif', 'svg', 'ico', 'woff', 'woff2', 'ttf', 'otf',
  'mp4', 'webm', 'mp3', 'ogg', 'glb', 'gltf', 'bin', 'usdz', 'riv']);
// Squeezed in the .zip (the others are squeezed already).
const TEXT = new Set(['html', 'htm', 'css', 'json', 'svg', 'gltf', 'bin', 'ico', 'ttf', 'otf']);
// AI tools' instruction files (AGENTS.md, CLAUDE.md, GEMINI.md) stay on your computer quietly, as README and LICENSE do.
const QUIET = /(^|\/)(__MACOSX|node_modules|\.[^/]*|Thumbs\.db|desktop\.ini|README(\.[a-z]+)?|LICENSE(\.[a-z]+)?|AGENTS\.md|CLAUDE\.md|GEMINI\.md)(\/|$)/i;
const MAX_FILES = 2000, FILE_MAX = 25 * 1048576, UPLOAD_MAX = 95 * 1048576, BATCH = 60 * 1048576;

// ---------- Output ----------
const tty = !!process.stdout.isTTY && !process.env.NO_COLOR;
const paint = (code) => (s) => (tty ? `\u001b[${code}m${s}\u001b[0m` : String(s));
const bold = paint('1'), dim = paint('2'), green = paint('32'), red = paint('31'), yellow = paint('33'), cyan = paint('36');
const say = (s = '') => console.log(s);
class Fail extends Error {}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const mb = (bytes) => (bytes >= 1048576 ? `${(bytes / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`);
const time = () => new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', second: '2-digit'});

// ---------- Arguments ----------
const argv = process.argv.slice(2);
const flags = new Set(argv.filter((a) => a.startsWith('-')));
const [command = 'help', ...words] = argv.filter((a) => !a.startsWith('-'));
const has = (...names) => names.some((n) => flags.has(n));

// ---------- Your sign-in (only on this computer, readable by you only) ----------
function readConfig() {
  try { return JSON.parse(fs.readFileSync(CONFIG, 'utf8')); } catch { return {}; }
}
function writeConfig(value) {
  fs.mkdirSync(CONFIG_DIR, {recursive: true, mode: 0o700});
  fs.writeFileSync(CONFIG, JSON.stringify(value, null, 2), {mode: 0o600});
  try { fs.chmodSync(CONFIG, 0o600); } catch {}
}
function account() {
  const a = readConfig().accounts?.[API];
  return a && typeof a.key === 'string' ? a : null;
}
function remember(a) {
  const c = readConfig();
  writeConfig({...c, accounts: {...(c.accounts || {}), [API]: a}});
}
function forget() {
  const c = readConfig();
  if (c.accounts?.[API]) { delete c.accounts[API]; writeConfig(c); }
}

// ---------- LINKDGER ----------
/** One call to LINKDGER. A call that is safe to send again (every one but push) tries up to 3 times when the network drops for a moment or
 *  LINKDGER is busy (502, 503, 504). */
async function call(method, p, {key, json, text, form, once = false} = {}) {
  const headers = {'User-Agent': UA, Accept: 'application/json'};
  if (key) headers.Authorization = 'Bearer ' + key;
  let body;
  if (json !== undefined) { headers['Content-Type'] = 'application/json'; body = JSON.stringify(json); }
  else if (text !== undefined) { headers['Content-Type'] = 'text/plain'; body = text; }
  else if (form) body = form;
  const tries = once ? 1 : 3;
  for (let i = 1; ; i++) {
    let status, raw;
    try {
      const r = await fetch(API + p, {method, headers, body});
      status = r.status;
      raw = await r.text();
    } catch (e) {
      if (i < tries) { await sleep(1000 * i); continue; }
      throw new Fail('Could not reach LINKDGER. Check the internet and try again.' + (process.env.DEBUG ? ` (${e.message})` : ''));
    }
    if ((status === 502 || status === 503 || status === 504) && i < tries) { await sleep(1000 * i); continue; }
    let data = null;
    try { data = raw ? JSON.parse(raw) : null; } catch {}
    return {status, data};
  }
}
function problem(res) {
  const m = res.data?.error?.message;
  if (m) return m;
  if (res.status === 413) return 'This upload is too big.';
  if (res.status === 429) return 'Too many requests. Wait a minute and try again.';
  if (res.status >= 500) return 'LINKDGER is busy. Try again in a minute.';
  return `LINKDGER answered ${res.status}.`;
}
async function signedIn(method, p, opts = {}) {
  const a = account();
  if (!a) throw new Fail(`Sign in first: ${RUN} login`);
  const res = await call(method, p, {...opts, key: a.key});
  if (res.status === 401) { forget(); throw new Fail(problem(res)); }
  return res;
}
/** Opens [url] in the browser (only an address made of plain characters). */
function openBrowser(url) {
  if (has('--no-open') || process.env.LINKDGER_NO_OPEN) return;
  if (!/^https?:\/\/[A-Za-z0-9.-]+(:[0-9]+)?(\/[A-Za-z0-9/?=._~-]*)?$/.test(url)) return;
  try {
    const p = process.platform === 'win32'
      ? spawn('cmd', ['/c', 'start', '""', url], {detached: true, stdio: 'ignore', windowsVerbatimArguments: true})
      : spawn(process.platform === 'darwin' ? 'open' : 'xdg-open', [url], {detached: true, stdio: 'ignore'});
    p.on('error', () => {});
    p.unref();
  } catch {}
}

// ---------- The theme's folder ----------
const hashes = new Map();
/** The folder's theme files (path → size, time, SHA-256), and the ones left out. */
async function scan(root) {
  const files = new Map(), left = [];
  async function walk(dir, rel) {
    let list;
    try { list = await fsp.readdir(dir, {withFileTypes: true}); } catch { return; }
    for (const e of list) {
      const r = rel ? `${rel}/${e.name}` : e.name, full = path.join(dir, e.name);
      if (QUIET.test(r)) continue;
      if (e.isDirectory()) { await walk(full, r); continue; }
      if (!e.isFile()) continue;
      const ext = (/\.([a-z0-9]+)$/i.exec(e.name)?.[1] || '').toLowerCase();
      if (!KINDS.has(ext)) { left.push(r); continue; }
      const st = await fsp.stat(full).catch(() => null);
      if (st) files.set(r, {full, size: st.size, time: st.mtimeMs, ext});
    }
  }
  await walk(root, '');
  return {files, left};
}
async function hashOf(f) {
  const hit = hashes.get(f.full);
  if (hit && hit.size === f.size && hit.time === f.time) return hit.sha;
  const sha = crypto.createHash('sha256').update(await fsp.readFile(f.full)).digest('hex');
  hashes.set(f.full, {size: f.size, time: f.time, sha});
  return sha;
}
async function manifestOf(files) {
  const out = {};
  for (const [p, f] of [...files].sort(([a], [b]) => (a < b ? -1 : 1))) out[p] = await hashOf(f);
  return out;
}
function checkFolder(root, files, {quiet} = {}) {
  if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) throw new Fail(`There is no folder ${root}`);
  if (!files.size) throw new Fail(`${root} has no theme files (index.html, style.css, pictures…).`);
  if (files.size > MAX_FILES) throw new Fail(`A theme can have up to ${MAX_FILES} files; this folder has ${files.size}.`);
  const big = [...files].find(([, f]) => f.size > FILE_MAX);
  if (big) throw new Fail(`${big[0]} is ${mb(big[1].size)}. A file can be up to 25 MB.`);
  if (!files.has('index.html') && !quiet) say(yellow('  This folder has no index.html (the home page). The check will say so.'));
}

// ---------- .zip ----------
const CRC = new Int32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c; });
function crc32(b) { let c = -1; for (let i = 0; i < b.length; i++) c = CRC[(c ^ b[i]) & 255] ^ (c >>> 8); return (c ^ -1) >>> 0; }
async function zipOf(files, names) {
  const locals = [], central = [];
  let off = 0;
  for (const name of names) {
    const f = files.get(name), data = await fsp.readFile(f.full), squeeze = TEXT.has(f.ext);
    const body = squeeze ? zlib.deflateRawSync(data, {level: 6}) : data, n = Buffer.from(name, 'utf8'), crc = crc32(data), method = squeeze ? 8 : 0;
    const lh = Buffer.alloc(30);
    lh.writeUInt32LE(0x04034b50, 0); lh.writeUInt16LE(20, 4); lh.writeUInt16LE(0x800, 6); lh.writeUInt16LE(method, 8); lh.writeUInt32LE(crc, 14);
    lh.writeUInt32LE(body.length, 18); lh.writeUInt32LE(data.length, 22); lh.writeUInt16LE(n.length, 26);
    const ch = Buffer.alloc(46);
    ch.writeUInt32LE(0x02014b50, 0); ch.writeUInt16LE(20, 4); ch.writeUInt16LE(20, 6); ch.writeUInt16LE(0x800, 8); ch.writeUInt16LE(method, 10); ch.writeUInt32LE(crc, 16);
    ch.writeUInt32LE(body.length, 20); ch.writeUInt32LE(data.length, 24); ch.writeUInt16LE(n.length, 28); ch.writeUInt32LE(off, 42);
    locals.push(lh, n, body); central.push(ch, n);
    off += 30 + n.length + body.length;
  }
  const cd = Buffer.concat(central), end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(names.length, 8); end.writeUInt16LE(names.length, 10); end.writeUInt32LE(cd.length, 12); end.writeUInt32LE(off, 16);
  return Buffer.concat([...locals, cd, end]);
}
const zipBlob = (bytes) => new Blob([new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.length)], {type: 'application/zip'});

// ---------- What the check said ----------
function report(r, {indent = '  '} = {}) {
  if (r.pages?.length) say(`${indent}Pages: ${r.pages.join(', ')}`);
  const changes = (r.changes || []).filter((c) => c.kind !== 'OK');
  for (const c of changes.slice(0, 12)) say(`${indent}${c.kind === 'PROBLEM' ? red('×') : yellow('•')} ${c.title}${c.detail ? dim(' · ' + c.detail) : ''}`);
  if (changes.length > 12) say(dim(`${indent}… and ${changes.length - 12} more`));
  const p = r.products;
  if (p && (p.new || p.missing || p.found)) {
    say(`${indent}Products: ${p.found} in your shop${p.new ? `, ${p.new} new in products.json (add them in the app: My shop → Settings → Website and theme)` : ''}${p.missing ? `, ${yellow(p.missing + ' not in your shop')}` : ''}`);
  }
}

// ---------- Commands ----------
async function login() {
  const name = (os.hostname() || 'A computer').slice(0, 60);
  const res = await call('POST', '/login', {json: {name}});
  if (res.status !== 200) throw new Fail(problem(res));
  const {code, poll, url, interval, expires_in: life} = res.data;
  say();
  say(`  Open ${cyan(url)}`);
  say(`  sign in with your LINKDGER number, check the code ${bold(code)} and tap Allow.`);
  say();
  openBrowser(url);
  const until = Date.now() + life * 1000;
  if (tty) process.stdout.write(dim('  Waiting for you to allow it '));
  while (Date.now() < until) {
    await sleep(Math.max(2, interval) * 1000);
    const t = await call('POST', '/token', {json: {poll}}).catch(() => null);
    if (!t || t.status === 202 || t.status >= 500) { if (tty) process.stdout.write(dim('.')); continue; }
    if (tty) process.stdout.write('\n');
    if (t.status === 200) {
      remember({key: t.data.key, expires_at: t.data.expires_at, shop: t.data.shop || null});
      say(`${green('  Signed in')} to ${bold(t.data.shop?.name || 'your shop')}. This computer can change its theme until ${new Date(t.data.expires_at).toDateString()}.`);
      say(dim(`  Next: ${RUN} dev   (in your theme's folder)`));
      return;
    }
    throw new Fail(t.status === 403 ? 'The sign-in was not allowed.' : t.status === 410 ? 'This sign-in has ended. Run it again.' : problem(t));
  }
  throw new Fail('The code ended after 10 minutes. Run the sign-in again.');
}

async function logout() {
  const a = account();
  if (!a) { say('  Not signed in here.'); return; }
  // Signed out only when LINKDGER ended the key (or it had ended already); else the key stays here, to try again.
  const res = await call('POST', '/logout', {key: a.key}).catch((e) => { if (e instanceof Fail) return null; throw e; });
  if (!res || (res.status !== 200 && res.status !== 401)) {
    throw new Fail(`Could not sign out on LINKDGER${res ? ` (${problem(res)})` : ''}. This computer is still signed in: run logout again, or remove it on https://linkdger.com/themes/cli`);
  }
  forget();
  say(`${green('  Signed out.')} This computer cannot change your theme any more.`);
}

async function whoami() {
  const res = await signedIn('GET', '/me');
  if (res.status !== 200) throw new Fail(problem(res));
  const m = res.data, a = account();
  say(`  ${bold(m.shop.name)}${m.shop.site ? '  ' + cyan(m.shop.site) : ''}`);
  say(`  Plan: ${String(m.plan || 'free').toUpperCase()} · themes use ${m.used_mb} of ${m.limit_mb} MB · ${m.versions} ${m.versions === 1 ? 'version' : 'versions'}`);
  if (m.dev) say(`  Dev copy: revision ${m.dev.rev}, last saved ${new Date(m.dev.updated_at).toLocaleString()}${m.dev.problem ? ' · ' + red(m.dev.problem) : ''}\n  ${cyan(m.dev.preview_url)}`);
  if (a?.expires_at) say(dim(`  This computer's sign-in ends ${new Date(a.expires_at).toDateString()}.`));
}

async function init(folder = 'my-theme') {
  const root = path.resolve(folder);
  if (fs.existsSync(root) && fs.readdirSync(root).length) throw new Fail(`${folder} is not empty. Pick a new folder name: ${RUN} init my-theme`);
  if (!fs.existsSync(STARTER)) throw new Fail('The starter theme is missing from this copy of the tool.');
  await fsp.cp(STARTER, root, {recursive: true});
  say(`${green('  Made')} ${folder} from Orbit, the example theme (3D, scroll effects, products, a bundle).`);
  say(dim(`  Next: cd ${folder}  then  ${RUN} dev`));
}

/** Sends the dev copy: the list of files, then only the files the server does not have (in parts under 60 MB). */
async function syncDev(root, state) {
  const {files, left} = await scan(root);
  checkFolder(root, files, {quiet: state.rev > 0});
  const manifest = await manifestOf(files), sig = JSON.stringify(manifest);
  if (sig === state.last) return;
  if (left.length && !state.leftSaid) { say(dim(`  Left on your computer (not theme files): ${left.slice(0, 6).join(', ')}${left.length > 6 ? ' …' : ''}`)); state.leftSaid = true; }
  const n = await signedIn('POST', '/dev/need', {text: JSON.stringify({files: manifest})});
  if (n.status !== 200) throw new Fail(problem(n));
  const need = n.data.need || [], parts = [];
  let part = [], size = 0;
  for (const p of need) {
    const s = files.get(p)?.size || 0;
    if (part.length && size + s > BATCH) { parts.push(part); part = []; size = 0; }
    part.push(p); size += s;
  }
  if (part.length || !parts.length) parts.push(part);
  let res = null;
  for (const names of parts) {
    const form = new FormData();
    form.append('manifest', sig);
    if (names.length) form.append('file', zipBlob(await zipOf(files, names)), 'dev.zip');
    res = await signedIn('POST', '/dev', {form});
    if (res.status === 409 && res.data?.error?.code === 'FILES_NEEDED' && names !== parts[parts.length - 1]) continue;
    break;
  }
  state.last = sig;
  const sent = need.length ? `${need.length} ${need.length === 1 ? 'file' : 'files'} sent` : 'nothing new to send';
  if (res.status === 200) {
    state.rev = res.data.rev;
    say(`${dim(time())} ${green('✓')} Revision ${res.data.rev} · ${sent} · ${mb(res.data.size_bytes)}`);
    report(res.data, {indent: '    '});
    if (!state.opened) {
      state.opened = true;
      say();
      say(`  Your dev copy: ${cyan(res.data.preview_url)}`);
      say(dim('  It reloads by itself each time you save. Only people with the link can see it; it is never live.'));
      say();
      openBrowser(res.data.preview_url);
    }
    return;
  }
  if (res.status === 409 && res.data?.error?.code === 'FILES_NEEDED') { state.last = null; throw new Fail('Some files changed while they were sent. Save again.'); }
  if (res.status === 401) throw new Fail(problem(res));
  say(`${dim(time())} ${red('×')} ${problem(res)}`);
  say(dim('    The dev copy keeps its last good version until you fix this and save.'));
}

async function dev(folder = '.') {
  const root = path.resolve(folder), state = {last: null, rev: 0, opened: false, leftSaid: false};
  if (!account()) throw new Fail(`Sign in first: ${RUN} login`);
  say(`  ${bold('Dev copy')} of ${root}`);
  await syncDev(root, state);
  if (has('--once')) return;
  say(dim('  Watching for saves. Ctrl+C stops (the dev copy stays 7 days; `dev-remove` removes it now).'));
  // Every 0.6 s: the folder's files, their sizes and times; a change waits 0.3 s for the rest of a save.
  let seen = null, busy = false;
  const look = async () => {
    const {files} = await scan(root);
    return [...files].map(([p, f]) => `${p}:${f.size}:${f.time}`).sort().join('|');
  };
  seen = await look();
  for (;;) {
    await sleep(600);
    if (busy) continue;
    const now = await look().catch(() => seen);
    if (now === seen) continue;
    await sleep(300);
    seen = await look().catch(() => now);
    busy = true;
    try { await syncDev(root, state); }
    catch (e) {
      if (!(e instanceof Fail)) throw e;
      say(`${dim(time())} ${red('×')} ${e.message}`);
      if (!account()) process.exit(1);
    } finally { busy = false; }
  }
}

async function devRemove() {
  const res = await signedIn('DELETE', '/dev');
  if (res.status !== 200) throw new Fail(problem(res));
  say(`${green('  Removed')} your dev copy. Its preview link has ended.`);
}

async function wholeZip(folder) {
  const root = path.resolve(folder), {files, left} = await scan(root);
  checkFolder(root, files);
  const bytes = await zipOf(files, [...files.keys()].sort());
  if (bytes.length > UPLOAD_MAX) throw new Fail(`The theme is ${mb(bytes.length)} packed. Upload it in the app (up to your plan's space); here up to 95 MB.`);
  return {root, files, left, bytes};
}

async function check(folder = '.') {
  const {root, files, bytes} = await wholeZip(folder);
  const form = new FormData();
  form.append('file', zipBlob(bytes), path.basename(root) + '.zip');
  const res = await signedIn('POST', '/check', {form});
  if (res.status !== 200) { say(`  ${red('×')} ${problem(res)}`); process.exitCode = 1; return; }
  say(`  ${green('✓')} Ready to upload · ${files.size} files · ${mb(res.data.size_bytes)}${res.data.animated ? ' · animated' : ''}`);
  report(res.data);
}

async function push(folder = '.') {
  const {root, bytes} = await wholeZip(folder);
  const form = new FormData();
  form.append('file', zipBlob(bytes), path.basename(root) + '.zip');
  say(`  Uploading ${mb(bytes.length)}…`);
  // Sent once: a second try after a dropped line could make two versions.
  const up = await signedIn('POST', '/push', {form, once: true});
  if (up.status !== 201) throw new Fail(problem(up));
  const id = up.data.version.id;
  let v = null;
  for (let i = 0; i < 240; i++) {
    const l = await signedIn('GET', '/versions');
    v = l.data?.versions?.find((x) => x.id === id);
    if (v && v.status !== 'CHECKING') break;
    await sleep(1500);
  }
  if (!v || v.status === 'CHECKING') throw new Fail('The check is taking long. See it in the app: My shop → Settings → Website and theme.');
  if (v.status === 'PROBLEM') { say(`  ${red('×')} Version ${v.number}: ${v.problem}`); process.exitCode = 1; return; }
  say(`  ${green('✓')} Version ${v.number} is ready.`);
  report(v);
  if (v.preview_url) say(`  Preview: ${cyan(v.preview_url)}`);
  if (!has('--live')) { say(dim(`  Make it live in the app, or: ${RUN} push --live`)); return; }
  if (!has('--yes', '-y')) {
    if (!process.stdin.isTTY) throw new Fail('Add --yes to make it live without asking.');
    const rl = readline.createInterface({input: process.stdin, output: process.stdout});
    const a = (await rl.question(`  Make version ${v.number} live on your website now? (y/N) `)).trim().toLowerCase();
    rl.close();
    if (a !== 'y' && a !== 'yes') { say('  Not made live.'); return; }
  }
  const live = await signedIn('POST', `/versions/${id}/live`);
  if (live.status !== 200) throw new Fail(problem(live));
  say(`  ${green('✓')} Version ${v.number} is live${live.data.site_url ? ' on ' + cyan(live.data.site_url) : ''}.`);
}

async function versions() {
  const res = await signedIn('GET', '/versions');
  if (res.status !== 200) throw new Fail(problem(res));
  const list = res.data.versions || [];
  say(`  Themes use ${res.data.used_mb} of ${res.data.limit_mb} MB${res.data.site_url ? ' · ' + cyan(res.data.site_url) : ''}`);
  if (!list.length) { say(dim('  No version yet.')); return; }
  const look = {LIVE: green('LIVE'), READY: 'Ready', OLD: dim('Old'), CHECKING: yellow('Checking'), PROBLEM: red('Problem')};
  for (const v of list) {
    say(`  ${String(v.number).padStart(3)}  ${(look[v.status] || v.status).padEnd(tty ? 17 : 8)} ${new Date(v.uploaded_at).toLocaleDateString()}  ${v.file_name || ''}${v.problem ? '  ' + red(v.problem) : ''}`);
    if (v.preview_url) say(dim(`       ${v.preview_url}`));
  }
}

function help() {
  say(`
  ${bold('LINKDGER theme tool')} ${dim(VERSION)}  · your shop's website theme on your computer

  ${RUN} ${bold('login')}            allow this computer (linkdger.com, your number, Allow)
  ${RUN} ${bold('init')} [folder]    start from Orbit, the example theme
  ${RUN} ${bold('dev')} [folder]     a dev copy that updates as you save (--once: one time)
  ${RUN} ${bold('check')} [folder]   the app's check, nothing saved
  ${RUN} ${bold('push')} [folder]    a new version (--live: make it live too; --yes: without asking)
  ${RUN} ${bold('versions')}         your versions
  ${RUN} ${bold('whoami')}           your shop, plan, space and dev copy
  ${RUN} ${bold('dev-remove')}       remove the dev copy now
  ${RUN} ${bold('logout')}           this computer can no longer change your theme

  The guide: ${cyan('https://linkdger.com/themes/guide#cli')}
`);
}

const commands = {login, logout, whoami, init, dev, 'dev-remove': devRemove, check, push, versions, help};
try {
  if (Number(process.versions.node.split('.')[0]) < 18) throw new Fail('The theme tool needs Node 18 or newer.');
  if (has('--version', '-v')) { say(VERSION); process.exit(0); }
  const run = has('--help', '-h') ? help : commands[command];
  if (!run) { help(); throw new Fail(`There is no "${command}" command.`); }
  await run(...words);
} catch (e) {
  if (e instanceof Fail) { console.error(`  ${red('×')} ${e.message}`); process.exitCode = 1; }
  else { console.error(e); process.exitCode = 1; }
}
