import test from 'node:test';
import assert from 'node:assert/strict';
import {startTimer,remaining,pauseTimer,resumeTimer,addTime,formatTime} from '../dist/timer.js';
test('deadline catches up after a delayed background tick and clamps at zero',()=>{const t=startTimer(90,'rank',1000);assert.equal(remaining(t,31000),60000);assert.equal(remaining(t,200000),0);});
test('pausing preserves the exact remaining duration, including after serialization',()=>{const t=pauseTimer(startTimer(90,'rank',1000),11500);const saved=JSON.parse(JSON.stringify(t));assert.equal(remaining(saved,100000),79500);resumeTimer(saved,100000);assert.equal(remaining(saved,110000),69500);});
test('adding time preserves pause state and restarts an expired timer',()=>{const t=pauseTimer(startTimer(60,'guess',0),10000);addTime(t,30,20000);assert.equal(remaining(t,999999),80000);assert.equal(t.running,false);const expired=startTimer(60,'rank',0);addTime(expired,30,100000);assert.equal(expired.running,true);assert.equal(remaining(expired,110000),20000);});
test('display rounds up and never shows a negative duration',()=>{assert.equal(formatTime(90000),'1:30');assert.equal(formatTime(1),'0:01');assert.equal(formatTime(0),'0:00');});
