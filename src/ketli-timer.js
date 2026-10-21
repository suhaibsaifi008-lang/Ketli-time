export function formatDuration(seconds){const value=Math.max(0,Math.ceil(Number(seconds)||0));return `${Math.floor(value/60)}:${String(value%60).padStart(2,'0')}`;}

// Calculate against a deadline so sleeping/background tabs do not accumulate drift.
export function createBrewingTimer({onTick=()=>{},onComplete=()=>{},now=()=>Date.now(),schedule=setInterval,unschedule=clearInterval}={}){
  let deadline=0,handle=null;
  const cancel=()=>{if(handle!==null)unschedule(handle);handle=null;deadline=0;};
  const tick=()=>{
    const seconds=Math.max(0,Math.ceil((deadline-now())/1000));onTick({seconds,formatted:formatDuration(seconds)});
    if(seconds===0){cancel();onComplete();}
  };
  return {
    start(seconds){if(!Number.isFinite(seconds)||seconds<=0||seconds>3600)throw new RangeError('Brewing time must be between 1 second and 1 hour.');cancel();deadline=now()+seconds*1000;handle=schedule(tick,1000);tick();},
    cancel,
    get active(){return handle!==null;}
  };
}
