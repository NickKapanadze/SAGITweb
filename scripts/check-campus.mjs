import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {gzipSync} from 'node:zlib';
import {locations,scene,project,projectedScene,posterSvg} from '../assets/js/campus-model.js';
assert.deepEqual(locations.map(p=>p.id),Array.from({length:14},(_,i)=>i+1));
assert.equal(new Set(locations.map(p=>p.key)).size,14);
const at=key=>locations.find(p=>p.key===key);
// Preserve the reference plan's key geographical relationships.
assert.ok(at('library').x<at('plaza').x&&at('library').z<at('plaza').z);
assert.ok(at('humanities').x>at('business').x);
assert.ok(at('residence').x>at('humanities').x);
assert.ok(at('park').x<at('academic').x);
assert.ok(at('research').z>at('academic').z);
assert.ok(at('stadium').x>at('research').x&&at('stadium').z>at('business').z);
for(const p of locations){
 for(const key of ['ka','en','introKa','introEn','kaText','enText','ctaKa','ctaEn'])assert.ok(p[key]?.length,`${p.key}: missing ${key}`);
 await access('dist'+new URL(p.link,'https://sagit.test').pathname);
 for(const [w,h] of [[390,330],[920,620]])for(const yaw of [-Math.PI,0,Math.PI]){
  const center=project([p.x,0,p.z],{x:p.x,z:p.z,yaw,pitch:.8,zoom:1.8},w,h);
  assert.equal(center[0],w/2);assert.equal(center[1],h*.53);
 }
}
const model=scene();assert.ok(model.length<1500,'Keep campus geometry bounded');
for(const pitch of [.35,.68,Math.PI/2]){
 const output=projectedScene(model,{x:-5,z:0,yaw:-.2,pitch,zoom:1.05},920,620,8);
 for(const polygon of output)for(const vertex of polygon.points)assert.ok(vertex.every(Number.isFinite),'finite geometry in every view');
 assert.ok(output.some(p=>p.color==='#e9bd79'),'selected school highlight');
}
let runtimeGzip=0;for(const name of ['campus.js','campus-model.js'])runtimeGzip+=gzipSync(await readFile('assets/js/'+name)).length;
assert.ok(runtimeGzip<16000,`Campus runtime gzip budget exceeded: ${runtimeGzip}`);
const home=await readFile('dist/index.html','utf8');assert.ok(gzipSync(home).length<45000,'Homepage gzip budget');
assert.ok(home.includes('<noscript>')&&home.includes('campus-plan.jpg'),'reference and no-JS fallback');
assert.ok(posterSvg().includes('<polygon'),'server-rendered landscape fallback');
console.log(`PASS: all 14 mapped destinations, plan geography, bilingual detail data, school links, camera projection, ${model.length} polygons, and ${runtimeGzip} compressed runtime bytes.`);
