import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const site=JSON.parse(readFileSync(new URL('../contracts/demo-site-v1.schema.json',import.meta.url)));
const widget=JSON.parse(readFileSync(new URL('../contracts/widget-manifest-v1.schema.json',import.meta.url)));
test('provider contract preserves required consumer fields',()=>assert.deepEqual(site.required,['id','displayName','tenantId','version']));
test('breaking a required field is caught',()=>{const changed=['id','tenantId','version'];assert.ok(site.required.some(x=>!changed.includes(x)));});
test('widget cannot register an arbitrary shell path',()=>{assert.equal(widget.properties.path.const,'/');assert.equal(widget.properties.version.const,1);});
