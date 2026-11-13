import test from 'node:test';
import assert from 'node:assert/strict';
import {chooseModel} from '../gateway/policy.mjs';
test('restricted data never uses external fallback',()=>{
 assert.deepEqual(chooseModel({dataClass:'restricted',allowExternal:false,localReady:false,externalReady:true,budgetRemaining:100}),{provider:null,reason:'local_unavailable'});
});
test('allowed external fallback still requires budget',()=>{
 assert.equal(chooseModel({dataClass:'public',allowExternal:true,localReady:false,externalReady:true,budgetRemaining:0}).provider,null);
 assert.equal(chooseModel({dataClass:'public',allowExternal:true,localReady:false,externalReady:true,budgetRemaining:10}).provider,'external');
});
