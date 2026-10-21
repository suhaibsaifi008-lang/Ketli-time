import './ketli.css';
import './ketli-photo-hero.css';
import { teas, galleryImage, searchTeas, recommendTeas, teaLink } from './ketli-catalog.js';
import { $, $$, mountChrome, bindLightbox, icon, productCard, reducedMotion, toast } from './ketli-common.js';
import { createBrewingTimer } from './ketli-timer.js';
import { gsap } from 'gsap';
import { mountNaturalMotion } from './ketli-motion.js';

mountChrome();bindLightbox();
$$('[data-icon]').forEach(node=>node.innerHTML=icon(node.dataset.icon));
let filter='all';
function renderCollection(){
  const list=searchTeas('',filter);$('#collection-grid').innerHTML=list.map(t=>productCard(t)).join('');
  $('#collection-count').textContent=`${list.length} ${list.length===1?'tea':'teas'} to discover`;
}
$$('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
  filter=button.dataset.filter;$$('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));renderCollection();
}));
renderCollection();

// Keep the photograph and copy together within the space below the real header.
const heroHeaderObserver=new ResizeObserver(()=>{
  document.documentElement.style.setProperty('--hero-header-height',`${$('#site-header').getBoundingClientRect().height}px`);
});
heroHeaderObserver.observe($('#site-header'));

$('#finder-form').addEventListener('submit',e=>{
  e.preventDefault();const data=new FormData(e.currentTarget);const list=recommendTeas(Object.fromEntries(data));
  const primary=list[0];
  $('#finder-result').innerHTML=`<div class="finder-result-heading"><p class="overline">Your next cup could be</p><h3>${primary.name}</h3><p>${primary.notes.join(' · ')}</p></div><a class="finder-match" href="${teaLink(primary.id)}">${galleryImage(primary,0,{eager:true})}<span><strong>${primary.name}</strong><span>${primary.type} / ${primary.caffeine}</span><span class="underlined">Explore my match ${icon('arrowUp')}</span></span></a><p class="finder-alternative">Also worth a look: <a href="${teaLink(list[1].id)}">${list[1].name}, ${list[1].type.toLowerCase()} ${icon('arrowUp')}</a></p><button type="button" class="underlined" id="finder-reset">Choose another moment</button>`;
  $('#finder-reset').addEventListener('click',()=>{$('#finder-result').innerHTML='';$('#finder-form input').focus();});
  if(!reducedMotion())gsap.fromTo($('#finder-result'),{opacity:.3,y:8},{opacity:1,y:0,duration:.35});
});

let packageView=0;
function renderPackaging(){
  $('#packaging-photo').innerHTML=galleryImage(teas[4],packageView,{className:'packaging-frame'});
  $('#packaging-photo>.gallery-frame').dataset.packagingPhoto=String(packageView===0);
  $('#packaging-photo-toggle').textContent=packageView===5?'See the little kettle ↗':'See how it opens ↗';
  $('#packaging-photo-toggle').setAttribute('aria-pressed',String(packageView===5));
}
const packageDetails={outside:{index:0,text:'The carton gives the collection its shape. It is decorative outer packaging and must stay dry.'},inside:{index:5,text:'A separate, sealed food-safe pouch is planned to protect the loose blends. Final pouch and seal specifications will be confirmed before launch.'},label:{index:4,text:'The front names the blend and 50 g weight. The back lists all four ingredients, benefits, brewing and storage. Production batch and business details are not invented for this concept.'}};
$$('[data-pack-detail]').forEach(button=>button.addEventListener('click',()=>{
  const item=packageDetails[button.dataset.packDetail];packageView=item.index;renderPackaging();$('#packaging-explanation').textContent=item.text;$$('[data-pack-detail]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
}));
$('#packaging-photo-toggle').addEventListener('click',()=>{packageView=packageView===5?0:5;renderPackaging();const key=packageView===5?'inside':'outside';$('#packaging-explanation').textContent=packageDetails[key].text;$$('[data-pack-detail]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.packDetail===key)));});
renderPackaging();

let brewTea=teas[0],brewMode='hot';
const timer=createBrewingTimer({
  onTick:state=>{$('#timer-display').textContent=state.formatted;},
  onComplete:()=>{$('#timer-status').textContent=`Your ${brewTea.name} is ready. Strain, sip and enjoy.`;$('#start-timer').disabled=false;$('#start-timer').innerHTML='Brew another cup '+icon('arrowUp');$('#cancel-timer').hidden=true;toast(`Your ${brewTea.name} is ready to strain.`);}
});
function cancelTimer(){timer.cancel();$('#timer-display').textContent='';$('#start-timer').disabled=false;$('#start-timer').innerHTML='Start my brewing timer '+icon('arrowUp');$('#cancel-timer').hidden=true;}
function renderBrew(){
  cancelTimer();$('#timer-status').textContent='';
  $('#brew-photo').innerHTML=galleryImage(brewTea,brewMode==='hot'?0:3);$('#brew-photo-caption').textContent=`${brewTea.name} / ${brewTea.colourOfCup}. Original concept imagery.`;
  $('#brew-title').textContent=brewTea.name;
  $('#brew-stats').innerHTML=`<div><strong>${brewTea.amount}</strong><span>loose botanical</span></div><div><strong>${brewTea.temp}°C</strong><span>water · 200 ml</span></div><div><strong>${brewTea.minutes} min</strong><span>steep time</span></div>`;
  $('#brew-step-one').textContent=`Add ${brewTea.amount} to a roomy infuser or teapot. Set out your favourite cup.`;
  $('#brew-step-two').textContent=`Pour over 200 ml water at ${brewTea.temp}°C. Cover and steep for about ${brewTea.minutes} minutes, then strain.`;
  $('#brew-step-three').textContent=brewTea.brew;
  $('#brew-serving').textContent=brewMode==='iced'?brewTea.iced:brewTea.pairing;
}
$('#brew-select').innerHTML=teas.map(t=>`<option value="${t.id}">${t.name} / ${t.type}</option>`).join('');
$('#brew-select').addEventListener('change',e=>{brewTea=teas.find(t=>t.id===e.target.value)||teas[0];renderBrew();});
$$('[data-brew-mode]').forEach(button=>button.addEventListener('click',()=>{brewMode=button.dataset.brewMode;$$('[data-brew-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));renderBrew();}));
$('#start-timer').addEventListener('click',()=>{timer.start(brewTea.minutes*60);$('#start-timer').disabled=true;$('#start-timer').textContent='Your tea is steeping';$('#cancel-timer').hidden=false;$('#timer-status').textContent=`Timer started for ${brewTea.name}. Keep this tab open.`;});
$('#cancel-timer').addEventListener('click',()=>{cancelTimer();$('#timer-status').textContent='Timer cancelled. Start again whenever you’re ready.';});
renderBrew();

const disposeMotion=mountNaturalMotion();
if(import.meta.hot)import.meta.hot.dispose(()=>{disposeMotion();timer.cancel();heroHeaderObserver.disconnect();});
