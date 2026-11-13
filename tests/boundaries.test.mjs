import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const files=['provider/server.mjs','consumer/server.mjs','widget/server.mjs','shell/server.mjs'];
test('no cross-module source imports',()=>{
 for(const path of files){const s=readFileSync(new URL('../'+path,import.meta.url),'utf8');
  assert.doesNotMatch(s,/from\s+['"]\.\.\//,path);
 }
});
test('no identifying business details in demo source',()=>{
 for(const path of files){const s=readFileSync(new URL('../'+path,import.meta.url),'utf8');
  assert.doesNotMatch(s,/company\.com|@example\.com|production[-_]api[-_]key/i,path);
 }
});
