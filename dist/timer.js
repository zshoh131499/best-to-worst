export function remaining(timer,now=Date.now()){
 return Math.max(0,timer.running?timer.deadline-now:timer.remaining);
}
export function startTimer(seconds,id,now=Date.now()){
 return {id,remaining:seconds*1000,deadline:now+seconds*1000,running:seconds>0,alerted:false};
}
export function pauseTimer(timer,now=Date.now()){
 timer.remaining=remaining(timer,now);timer.running=false;return timer;
}
export function resumeTimer(timer,now=Date.now()){
 if(timer.remaining>0){timer.deadline=now+timer.remaining;timer.running=true;}return timer;
}
export function addTime(timer,seconds,now=Date.now()){
 const expired=remaining(timer,now)===0;
 timer.remaining=remaining(timer,now)+seconds*1000;
 timer.deadline=now+timer.remaining;
 if(expired)timer.running=true;
 timer.alerted=false;return timer;
}
export function formatTime(ms){const s=Math.ceil(ms/1000);return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;}
