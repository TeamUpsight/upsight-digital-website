import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

test('detector is local until consent; report omits query, hash and GA identifiers', async () => {
  const listeners=new Map(), calls=[], beacons=[], timers=[];
  let storageReads=0;
  const window={addEventListener:(name,callback)=>listeners.set(name,callback),dispatchEvent:()=>{}};
  const context={
    window, location:{origin:'https://upsight.digital',pathname:'/contact',href:'https://upsight.digital/contact?email=private@example.com#private'},
    document:{body:{appendChild(){}},createElement:()=>({style:{},setAttribute(){},remove(){},isConnected:true,offsetHeight:1,offsetWidth:1})},
    getComputedStyle:()=>({display:'block',visibility:'visible',opacity:'1'}),
    sessionStorage:{getItem(){storageReads++;return null},setItem(){}},
    setTimeout:(callback,ms)=>{timers.push({callback,ms});return timers.length},clearTimeout(){},
    CustomEvent:class {constructor(type,init){this.type=type;this.detail=init.detail}},
    Image:class {set src(url){beacons.push(url)}},
    fetch:async (url,init)=>{calls.push({url,init});return new Response()},
    AbortController,URLSearchParams,crypto,
  };
  runInNewContext(readFileSync('public/adblocker-detector.js','utf8'),context);
  timers.find(timer=>timer.ms===2000).callback();
  await new Promise(setImmediate);
  assert.equal(calls.length,0);assert.equal(beacons.length,0);assert.equal(storageReads,0);
  const update=listeners.get('upsight:consent');
  update({detail:{analytics_storage:'granted'}});
  await new Promise(setImmediate);assert.equal(calls.length,0);
  update({detail:{analytics_storage:'granted',ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted'}});
  await new Promise(setImmediate);
  assert.equal(calls.length,3);assert.equal(beacons.length,1);
  for(const call of calls){assert.equal(call.init.credentials,'omit');assert.equal(call.init.referrerPolicy,'no-referrer')}
  const report=new URL(beacons[0]);
  assert.equal(report.searchParams.get('landing_page'),'https://upsight.digital/contact');
  assert.equal(report.searchParams.has('client_id'),false);
  assert.doesNotMatch(beacons[0],/private|_ga/);
  update({detail:{}});
  await new Promise(setImmediate);assert.equal(calls.length,3);
});
