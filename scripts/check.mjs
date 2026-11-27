import {readdir,readFile,access} from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=path.resolve('dist');
const files=(await readdir(root)).filter(f=>f.endsWith('.html'));
let links=0,translations=0;
for(const file of files){
 const html=await readFile(path.join(root,file),'utf8');
 assert.equal((html.match(/<h1\b/g)||[]).length,1,`${file}: needs one h1`);
 assert.ok(html.includes('<html lang="ka">'),`${file}: Georgian default`);
 assert.ok(html.includes('<main id="main">'),`${file}: main landmark`);
 assert.ok(!/href="#"|loading-screen|2025-10-20/.test(html),`${file}: obsolete placeholder`);
 assert.ok(!/<canvas|campus-poster|data-camera|campus-explorer/.test(html),`${file}: retired 3D UI must stay removed`);
 assert.ok(!/იუმორ|სატირ|გამოგონილ|satir|fiction|humor|KA \/ EN/i.test(html),`${file}: stay in university character`);
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(ids.length,new Set(ids).size,`${file}: duplicate ids`);
 for(const match of html.matchAll(/data-ka="([^"]*)" data-en="([^"]*)"/g)){assert.ok(match[1]&&match[2],`${file}: empty translation`);translations++;}
 for(const match of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  const value=match[1];if(/^(https?:|mailto:)/.test(value))continue;
  const parsed=new URL(value,'https://local.test/'+file),url=parsed.pathname,hash=parsed.hash.slice(1);const target=path.resolve(root,'.'+url);
  await access(target);links++;
  if(hash){const targetHtml=await readFile(target,'utf8');assert.ok(targetHtml.includes(`id="${hash}"`),`${file}: broken fragment ${value}`);}
 }
}
assert.equal(files.length,16);
for(const retired of ['assets/js/campus.js','assets/js/campus-model.js','assets/style/campus.css']){
 await assert.rejects(access(path.join(root,retired)),`${retired}: retired asset still published`);
}
const campus=await readFile(path.join(root,'campus.html'),'utf8');
assert.equal((campus.match(/class="destination-detail"/g)||[]).length,14,'Campus keeps all 14 informative destinations');
const js=await readFile('assets/js/site.js','utf8');assert.ok(js.includes('try { localStorage.setItem'), 'storage-disabled browsers supported');
console.log(`PASS: ${files.length} pages, ${links} local links/assets, ${translations} bilingual strings, landmarks, unique IDs, and all fragment targets.`);
