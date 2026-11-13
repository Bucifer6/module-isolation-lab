import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {spawn} from 'node:child_process';
import net from 'node:net';
import {randomBytes,createHmac} from 'node:crypto';
const parent=resolve(import.meta.dirname,'../..');
const paths={alpha:resolve(parent,'component-alpha'),beta:resolve(parent,'component-beta'),shell:resolve(parent,'component-shell')};
const pause=ms=>new Promise(r=>setTimeout(r,ms));
async function port(){return new Promise((resolve,reject)=>{const s=net.createServer();s.on('error',reject);s.listen(0,'127.0.0.1',()=>{const p=s.address().port;s.close(()=>resolve(p));});});}
async function start(root,file,p,opts){
 const child=spawn(process.execPath,[file],{cwd:root,env:{...process.env,PORT:String(p),...opts},stdio:'ignore'});
 for(let i=0;i<80;i++){if(child.exitCode!==null)throw Error('Service exited: '+root);
  try{if((await fetch('http://127.0.0.1:'+p+'/healthz',{signal:AbortSignal.timeout(150)})).ok)return child;}catch{}await pause(35);
 }
 child.kill();throw Error('Service not ready: '+root);
}
async function stop(child){if(!child)return;child.kill('SIGTERM');await Promise.race([new Promise(r=>child.once('exit',r)),pause(600)]);if(child.exitCode===null)child.kill('SIGKILL');}
function token(tenant,secret){const p=Buffer.from(JSON.stringify({tenant})).toString('base64url');const mac=createHmac('sha256',secret).update(p).digest('base64url');return 'Bearer '+p+'.'+mac;}
test('published provider/consumer schemas are identical',()=>{
 const provider=JSON.parse(readFileSync(resolve(paths.alpha,'contracts/demo-site-v1.schema.json'),'utf8'));
 const consumer=JSON.parse(readFileSync(resolve(paths.beta,'contracts/demo-site-v1.schema.json'),'utf8'));
 assert.deepEqual(consumer,provider);
 assert.deepEqual(provider.required,['id','displayName','tenantId','version']);
});
test('services communicate via HTTP and shell survives failures',async()=>{
 const ports=await Promise.all([port(),port(),port(),port()]);
 const [ap,bp,wp,sp]=ports;
 const secret=randomBytes(36).toString('hex');let alpha,beta,widget,shell;
 try{
  alpha=await start(paths.alpha,'src/server.mjs',ap,{LAB_SECRET:secret});
  beta=await start(paths.beta,'src/server.mjs',bp,{LAB_SECRET:secret,PROVIDER_URL:'http://127.0.0.1:'+ap});
  widget=await start(paths.shell,'fixture-widget/server.mjs',wp,{});
  shell=await start(paths.shell,'src/server.mjs',sp,{WIDGET_URL:'http://127.0.0.1:'+wp});
  const endpoint='http://127.0.0.1:'+bp+'/v1/demo-tasks/task_one';
  assert.equal((await fetch(endpoint)).status,401);
  assert.equal((await fetch(endpoint,{headers:{authorization:token('tenant-b',secret)}})).status,403);
  const ok=await fetch(endpoint,{headers:{authorization:token('tenant-a',secret)}});assert.equal(ok.status,200);
  assert.equal((await ok.json()).site.displayName,'Synthetic Location One');
  assert.match(await(await fetch('http://127.0.0.1:'+sp+'/')).text(),/Synthetic Widget/);
  await stop(alpha);alpha=null;
  assert.equal((await fetch(endpoint,{headers:{authorization:token('tenant-a',secret)}})).status,503);
  assert.equal((await fetch('http://127.0.0.1:'+sp+'/healthz')).status,200);
  await stop(widget);widget=null;
  assert.match(await(await fetch('http://127.0.0.1:'+sp+'/')).text(),/Shell works independently/);
 }finally{await Promise.all([alpha,beta,widget,shell].map(stop));}
});
