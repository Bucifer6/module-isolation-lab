import test from 'node:test';
import assert from 'node:assert/strict';
import net from 'node:net';
import {spawn} from 'node:child_process';
import {randomBytes} from 'node:crypto';
import {sign} from '../provider/token.mjs';

const secret=randomBytes(36).toString('hex');
async function port(){return await new Promise((resolve,reject)=>{const s=net.createServer();s.on('error',reject);s.listen(0,'127.0.0.1',()=>{const p=s.address().port;s.close(()=>resolve(p));});});}
async function start(path,p,extra={}){
 const child=spawn(process.execPath,[path],{env:{...process.env,LAB_SECRET:secret,PORT:String(p),...extra},stdio:'ignore'});
 for(let n=0;n<60;n++){if(child.exitCode!==null)throw Error(path+' exited');try{const r=await fetch('http://127.0.0.1:'+p+'/healthz',{signal:AbortSignal.timeout(200)});if(r.ok)return child;}catch{}await new Promise(r=>setTimeout(r,30));}
 child.kill();throw Error(path+' failed to start');
}
async function stop(child){if(!child)return;child.kill('SIGTERM');await Promise.race([new Promise(r=>child.once('exit',r)),new Promise(r=>setTimeout(r,500))]);if(child.exitCode===null)child.kill('SIGKILL');}
test('four services: tenant denial, contract, widget and provider outage',async()=>{
 const [pp,cp,wp,sp]=await Promise.all([port(),port(),port(),port()]);
 let provider,consumer,widget,shell;
 const a=sign('tenant-a',secret),b=sign('tenant-b',secret);
 try{
  provider=await start('provider/server.mjs',pp);
  consumer=await start('consumer/server.mjs',cp,{PROVIDER_URL:'http://127.0.0.1:'+pp});
  widget=await start('widget/server.mjs',wp);
  shell=await start('shell/server.mjs',sp,{WIDGET_URL:'http://127.0.0.1:'+wp});
  const endpoint='http://127.0.0.1:'+pp+'/v1/demo-sites/demo_one';
  assert.equal((await fetch(endpoint)).status,401);
  assert.equal((await fetch(endpoint,{headers:{authorization:b}})).status,403);
  assert.equal((await fetch(endpoint,{headers:{authorization:a}})).status,200);
  const task='http://127.0.0.1:'+cp+'/v1/demo-tasks/task_one';
  assert.equal((await fetch(task,{headers:{authorization:b}})).status,403);
  const ok=await fetch(task,{headers:{authorization:a}});assert.equal(ok.status,200);
  assert.equal((await ok.json()).site.displayName,'Synthetic Location One');
  const homepage=await (await fetch('http://127.0.0.1:'+sp+'/')).text();
  assert.match(homepage,/Synthetic Widget/);
  assert.match(homepage,/sandbox=""/);
  await stop(provider);provider=null;
  const unavailable=await fetch(task,{headers:{authorization:a}});
  assert.equal(unavailable.status,503);
  assert.equal((await unavailable.json()).error,'dependency_unavailable');
  assert.equal((await fetch('http://127.0.0.1:'+sp+'/healthz')).status,200);
  await stop(widget);widget=null;
  const fallback=await (await fetch('http://127.0.0.1:'+sp+'/')).text();
  assert.match(fallback,/Shell works independently/);
 }finally{await Promise.all([provider,consumer,widget,shell].map(stop));}
});
