import {readdirSync,readFileSync,statSync} from 'node:fs';
import {join} from 'node:path';
function walk(dir){for(const name of readdirSync(dir)){
 if(name==='.git'||name==='node_modules')continue;
 const p=join(dir,name);if(statSync(p).isDirectory())walk(p);else {
  if(/^(\.env|id_rsa|.*\.pem|.*\.p12)$/.test(name)&&name!=='.env.example')throw Error('Forbidden sensitive file '+p);
  const s=readFileSync(p,'utf8');if(/customer@[a-z0-9.-]+|production[-_]api[-_]key/i.test(s)&&!p.endsWith('check-anonymity.mjs'))throw Error('Sensitive test string '+p);
 }
}}
walk('.');console.log('PASS: basic identifier and sensitive-file checks; git metadata is not anonymous');
