import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ketli-atmosphere.css';
gsap.registerPlugin(ScrollTrigger);

const pending=new WeakMap(),fades=new Map();
function finishFades(){
  for(const [container,{tween,overlay}] of fades){tween.kill();overlay.remove();fades.delete(container);}
}
/** Keep the current frame visible until its replacement has decoded. Latest selection wins. */
export function transitionGallery(container,html){
  const token={};pending.set(container,token);
  const holder=document.createElement('div');holder.innerHTML=html;
  const next=holder.firstElementChild,image=next?.querySelector('img');
  if(!next||!image)return;
  const commit=()=>{
    if(!container.isConnected||pending.get(container)!==token)return;
    const active=fades.get(container);if(active){active.tween.kill();active.overlay.remove();fades.delete(container);}
    const previous=container.querySelector(':scope > .gallery-frame');
    container.replaceChildren(next);
    if(!previous||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const overlay=document.createElement('div');overlay.className='gallery-crossfade';overlay.setAttribute('aria-hidden','true');overlay.append(previous);
    container.append(overlay);
    const tween=gsap.to(overlay,{opacity:0,duration:.18,ease:'none',onComplete:()=>{overlay.remove();if(fades.get(container)?.overlay===overlay)fades.delete(container);}});
    fades.set(container,{tween,overlay});
  };
  if(image.complete&&image.naturalWidth)commit();
  else image.decode().then(commit,()=>{
    if(pending.get(container)!==token)return;
    container.dispatchEvent(new CustomEvent('ketli:image-error',{bubbles:true}));
  });
}

function heroTravel(image){
  if(!image.naturalWidth||!image.naturalHeight)return 0;
  const bounds=image.getBoundingClientRect(),hero=image.closest('.brand-hero');
  const action=hero.querySelector('.hero-actions').getBoundingClientRect();
  const fit=getComputedStyle(image).objectFit;
  const scale=(fit==='contain'?Math.min:Math.max)(bounds.width/image.naturalWidth,bounds.height/image.naturalHeight);
  const position=parseFloat(getComputedStyle(image).objectPosition.split(' ')[1])/100;
  // Each art-directed photograph has a measured handle line, independent of source resolution.
  const handleRatio=image.naturalWidth/image.naturalHeight>2?384/821:467/1024;
  const handles=hero.getBoundingClientRect().top+image.naturalHeight*handleRatio*scale+(bounds.height-image.naturalHeight*scale)*position;
  return Math.max(0,Math.min(10,handles-action.bottom-16));
}

/** One scoped controller per page. Dynamic cards and packaging swaps reuse this lifecycle. */
export function mountNaturalMotion(){
  const surfaces='#collection,#brewing,.product-story,.product-brewing,.related-section';
  document.querySelectorAll(surfaces).forEach(el=>el.classList.add('botanical-surface'));
  const mm=gsap.matchMedia(),seen=new WeakSet();
  let disposed=false;
  mm.add({
    allowed:'(prefers-reduced-motion: no-preference)',
    desktop:'(min-width: 768px)',
    hover:'(hover: hover) and (pointer: fine)'
  },context=>{
    if(!context.conditions.allowed)return ()=>finishFades();
    const entries=new Map();let frame=0;
    const add=(el,create)=>{
      if(entries.has(el))return;
      entries.set(el,create());
    };
    const reveal=(el,distance,delay=0)=>{
      el.dataset.naturalPhoto='true';
      if(seen.has(el))return ()=>{delete el.dataset.naturalPhoto;gsap.set(el,{clearProps:'transform,opacity'});};
      const tween=gsap.fromTo(el,{y:distance,opacity:.35},{y:0,opacity:1,duration:.8,delay,ease:'power2.out',onComplete:()=>seen.add(el),scrollTrigger:{trigger:el,start:'top 86%',once:true}});
      return ()=>{tween.scrollTrigger?.kill();tween.kill();gsap.killTweensOf(el);gsap.set(el,{clearProps:'transform,opacity'});delete el.dataset.naturalPhoto;};
    };
    const sync=()=>{
      for(const [el,cleanup] of entries)if(!el.isConnected){cleanup();entries.delete(el);}
      document.querySelectorAll('.tea-card-visual > a > .gallery-frame').forEach((el,index)=>add(el,()=>{
        const disposeReveal=reveal(el,10,(index%3)*.09),visual=el.closest('.tea-card-visual');
        const enter=()=>gsap.to(el,{rotationY:1.5,rotationX:-.75,transformPerspective:1000,duration:.28,ease:'power2.out',overwrite:'auto'});
        const leave=()=>gsap.to(el,{rotationY:0,rotationX:0,duration:.38,ease:'power2.out',overwrite:'auto'});
        if(context.conditions.desktop&&context.conditions.hover){visual.addEventListener('pointerenter',enter);visual.addEventListener('pointerleave',leave);visual.addEventListener('pointercancel',leave);}
        return ()=>{visual.removeEventListener('pointerenter',enter);visual.removeEventListener('pointerleave',leave);visual.removeEventListener('pointercancel',leave);disposeReveal();};
      }));
      document.querySelectorAll('.ingredient-grid img').forEach((el,index)=>add(el,()=>reveal(el,8,(index%4)*.06)));
      if(context.conditions.desktop){
        const image=document.querySelector('.hero-landscape>picture>img');
        if(image)add(image,()=>{
          const landscape=image.closest('.hero-landscape');
          const loaded=()=>{landscape.style.backgroundImage='url("'+(image.currentSrc||image.src)+'")';ScrollTrigger.refresh();};
          loaded();
          const tween=gsap.to(image,{y:()=>-heroTravel(image),ease:'none',scrollTrigger:{trigger:'.brand-hero',start:'top top',end:'bottom top',scrub:.45,invalidateOnRefresh:true}});
          image.addEventListener('load',loaded);
          return ()=>{tween.scrollTrigger.kill();tween.kill();gsap.set(image,{clearProps:'transform'});landscape.style.removeProperty('background-image');image.removeEventListener('load',loaded);};
        });
        document.querySelectorAll('[data-packaging-photo="true"]').forEach(el=>add(el,()=>{
          el.dataset.naturalPhoto='true';
          const tween=gsap.fromTo(el,{y:7},{y:-7,ease:'none',scrollTrigger:{trigger:el.closest('#packaging'),start:'top bottom',end:'bottom top',scrub:.5}});
          return ()=>{tween.scrollTrigger.kill();tween.kill();gsap.set(el,{clearProps:'transform'});delete el.dataset.naturalPhoto;};
        }));
      }
    };
    const schedule=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{context.add(sync);ScrollTrigger.refresh();});};
    context.add(sync);
    const observer=new MutationObserver(schedule);
    for(const selector of ['#collection-grid','#packaging-photo']){const el=document.querySelector(selector);if(el)observer.observe(el,{childList:true});}
    return ()=>{
      observer.disconnect();cancelAnimationFrame(frame);
      for(const cleanup of entries.values())cleanup();entries.clear();finishFades();
    };
  });
  const preference=matchMedia('(prefers-reduced-motion: reduce)');
  const changed=()=>{if(preference.matches)finishFades();};
  preference.addEventListener('change',changed);
  const onHide=event=>{if(!event.persisted)dispose();};
  window.addEventListener('pagehide',onHide);
  function dispose(){
    if(disposed)return;disposed=true;mm.revert();finishFades();
    preference.removeEventListener('change',changed);window.removeEventListener('pagehide',onHide);
    document.querySelectorAll(surfaces).forEach(el=>el.classList.remove('botanical-surface'));
  }
  return dispose;
}
