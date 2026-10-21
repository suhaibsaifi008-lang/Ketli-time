import './ketli-packaging.css';
import './ketli-polish.css';
import './ketli-atmosphere.css';
import { mountCart, addButton } from './ketli-cart.js';
import { teas, getTea, money, galleryImage, galleryViews, searchTeas, validateSaved, teaLink } from './ketli-catalog.js';

const paths = {
  search:'m21 21-4.5-4.5M19 10.5a8.5 8.5 0 1 1-17 0 8.5 8.5 0 0 1 17 0',
  heart:'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z',
  arrow:'M5 12h14m-6-6 6 6-6 6',arrowUp:'M5 19 19 5M5 5h14v14',close:'m6 6 12 12M6 18 18 6',menu:'M3 6h18M3 12h18M3 18h18',
  left:'m15 5-7 7 7 7',right:'m9 5 7 7-7 7',plus:'M12 5v14M5 12h14',zoom:'M21 21l-5-5M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0M10 6v8M6 10h8',check:'m5 12 4 4L19 6',share:'M12 16V3m-5 5 5-5 5 5M5 12v9h14v-9',leaf:'M20 3C8 1 1 9 5 16s15 3 15-13ZM4 21 16 8',cup:'M4 5h13v9a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5ZM17 6h2a3 3 0 0 1 0 6h-2M3 22h16',clock:'M12 7v5l3 2M22 12A10 10 0 1 1 2 12a10 10 0 0 1 20 0',box:'m3 7 9-5 9 5v11l-9 5-9-5ZM3 7l9 5 9-5M12 12v11',sun:'M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1M17 12a5 5 0 1 1-10 0 5 5 0 0 1 10 0'
};
export function icon(name,cls='') { return `<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="${paths[name] || paths.leaf}"/></svg>`; }
export const $ = (selector,root=document) => root.querySelector(selector);
export const $$ = (selector,root=document) => [...root.querySelectorAll(selector)];
export const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
let saved=[];
let storageAvailable=true;
try {
  // Migrate the previous spelling's storage key without losing the visitor's tea shelf.
  const legacyKey='kateli-saved';
  const current=localStorage.getItem('ketli-saved');
  const previous=current===null?localStorage.getItem(legacyKey):null;
  saved=validateSaved(JSON.parse(current??previous??'[]'));
  if(previous!==null){localStorage.setItem('ketli-saved',JSON.stringify(saved));localStorage.removeItem(legacyKey);}
} catch { storageAvailable=false; }
let toastTimeout;

export function toast(message) {
  const node=$('#toast'); if(!node)return;
  clearTimeout(toastTimeout);node.textContent=message;node.classList.add('is-visible');toastTimeout=setTimeout(()=>node.classList.remove('is-visible'),3600);
}
export function getSaved() { return [...saved]; }
export function isSaved(id) { return saved.includes(id); }
function syncSaved() {
  try{localStorage.setItem('ketli-saved',JSON.stringify(saved));storageAvailable=true;}catch{storageAvailable=false;}
  $$('[data-saved-count]').forEach(el=>el.textContent=String(saved.length));
  $$('[data-save]').forEach(button=>{
    const active=saved.includes(button.dataset.save);button.setAttribute('aria-pressed',String(active));button.classList.toggle('is-saved',active);
    const label=$('[data-save-label]',button);if(label)label.textContent=active?'Saved to your tea shelf':'Save to my tea shelf';
    button.setAttribute('aria-label',(active?'Remove ':'Save ')+(getTea(button.dataset.save)?.name || 'tea')+(active?' from':' to')+' your tea shelf');
  });
  document.dispatchEvent(new CustomEvent('ketli:saved'));
}
export function toggleSave(id) {
  if(!getTea(id))return;saved=saved.includes(id)?saved.filter(value=>value!==id):[...saved,id];syncSaved();
  toast(`${getTea(id).name} ${saved.includes(id)?'saved to':'removed from'} your tea shelf.${storageAvailable?'':' Saved for this visit only.'}`);
}
export function saveButton(t,{full=false}={}) { return `<button type="button" class="${full?'button button-olive save-full':'save-heart'} ${isSaved(t.id)?'is-saved':''}" data-save="${t.id}" aria-pressed="${isSaved(t.id)}" aria-label="Save ${t.name} to your tea shelf">${icon('heart')}${full?`<span data-save-label>${isSaved(t.id)?'Saved to your tea shelf':'Save to my tea shelf'}</span>`:''}</button>`; }
export function productCard(t,{compact=false}={}) { return `<article class="tea-card ${compact?'is-compact':''}" style="--tea:${t.colour};--wash:${t.wash}"><div class="tea-card-visual"><a href="${teaLink(t.id)}" aria-label="Discover ${t.name}, ${t.type.toLowerCase()}">${galleryImage(t,0)}<span class="card-discover">Discover ${t.name} ${icon('arrowUp')}</span></a>${saveButton(t)}<span class="card-caffeine">${t.caffeine}</span></div><div class="tea-card-heading"><a href="${teaLink(t.id)}"><h3>${t.name}</h3><p>${t.type} blend</p></a><a class="circle-link" href="${teaLink(t.id)}" aria-label="Explore ${t.name}">${icon('arrowUp')}</a></div><p class="tea-card-notes">${t.helps}</p><div class="tea-card-bottom"><span>${t.weight} g loose blend</span><span>${t.minutes} min steep</span></div>${addButton(t)}<p class="price-disclosure">Project-only price · ${money(t.price)}</p></article>`; }

export function openDialog(dialog) { if(dialog && !dialog.open)dialog.showModal(); }
export function closeDialog(dialog) { dialog?.close(); }

export function mountChrome() {
  const home=location.pathname==='/' || location.pathname==='/index.html';
  const anchor=id=>home?'#'+id:'/#'+id;
  $('#site-header').innerHTML=`<div class="announcement"><span>Thoughtful teas. A kettle-shaped box. A little time for you.</span><a href="${anchor('collection')}">Explore the first collection ${icon('arrowUp')}</a></div><header class="header"><a class="brand" href="/" aria-label="Ketli Time home"><img src="/images/ketli-time/wordmark.webp" width="530" height="243" alt="Ketli Time"></a><nav class="desktop-nav" aria-label="Main navigation"><a href="${anchor('collection')}">Explore our teas</a><a href="${anchor('tea-finder')}">Find your cup</a><a href="${anchor('packaging')}">The little kettle</a><a href="${anchor('our-story')}">Our story</a></nav><div class="header-actions"><button type="button" data-open-search aria-label="Search teas">${icon('search')}</button><button type="button" data-open-shelf aria-label="Open your saved tea shelf">${icon('heart')}<span data-saved-count>${saved.length}</span></button><button type="button" data-open-cart aria-label="Open demo shopping bag">${icon('box')}<span data-cart-count>0</span></button><button type="button" class="mobile-menu-button" aria-label="Open navigation" aria-expanded="false" aria-controls="mobile-nav">${icon('menu')}</button></div><nav id="mobile-nav" aria-label="Mobile navigation" hidden><a href="${anchor('collection')}">Explore our teas</a><a href="${anchor('tea-finder')}">Find your cup</a><a href="${anchor('packaging')}">The little kettle</a><a href="${anchor('brewing')}">Brewing guide</a><a href="${anchor('our-story')}">Our story</a></nav></header>`;
  $('#site-footer').innerHTML=`<footer><div class="footer-main"><div class="footer-brand"><img src="/images/ketli-time/brand.webp" alt="Ketli Time logo: tea picker amongst botanical leaves" width="540" height="920" loading="lazy"><p>Rooted in botanicals.<br>Made for your everyday.</p></div><div><h3>Your next cup</h3>${teas.map(t=>`<a href="${teaLink(t.id)}">${t.name}<span>${t.type}</span></a>`).join('')}</div><div><h3>Around the kettle</h3><a href="${anchor('tea-finder')}">Find your tea</a><a href="${anchor('brewing')}">How to brew</a><a href="${anchor('packaging')}">The packaging</a><a href="${anchor('questions')}">Questions & answers</a><a href="/store-information.html">Collection & privacy</a><button data-open-privacy>Manage saved teas</button></div><div class="footer-note"><h3>Let’s make<br>time for tea.</h3><p>Six distinct teas and infusions.<br>One thoughtful first collection.</p><p class="small">Academic marketing concept.<br>Try the shopping demo. No real orders.</p></div></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} Ketli Time</span><span>Original product concept imagery</span><span>Botanical pleasure. No miracle promises.</span></div></footer>`;
  const shell=document.createElement('div');shell.id='dialog-shell';shell.innerHTML=`<dialog id="search-dialog" class="search-dialog" aria-labelledby="search-title"><button class="dialog-close" data-close-dialog aria-label="Close search">${icon('close')}</button><p class="overline">A cup for every kind of day</p><h2 id="search-title">What are you looking for?</h2><label class="search-field">${icon('search')}<input type="search" id="tea-search" placeholder="Try rose, caffeine-free or iced…" autocomplete="off" maxlength="100" aria-label="Search teas by name, ingredient or flavour"></label><p id="search-count" class="small" role="status"></p><div id="search-results"></div></dialog><dialog id="shelf-dialog" class="shelf-dialog" aria-labelledby="shelf-title"><button class="dialog-close" data-close-dialog aria-label="Close tea shelf">${icon('close')}</button><p class="overline">Keep a little room for favourites</p><h2 id="shelf-title">Your tea shelf</h2><div id="shelf-items"></div><div id="shelf-actions"></div><p class="small muted">Saved on this device. Saving a tea does not place an order or reserve stock.</p></dialog><dialog id="privacy-dialog" class="info-dialog" aria-labelledby="privacy-title"><button class="dialog-close" data-close-dialog aria-label="Close privacy information">${icon('close')}</button><h2 id="privacy-title">Your teas, your device.</h2><p>Your tea shelf lives in this browser’s local storage. We do not collect your name or email through the current tea experience. Your demo shopping bag is also stored locally. No real payment, order or advertising tracker is connected.</p><p>The brewing timer and tea finder work in your browser. All tea imagery is served locally; our chosen fonts are also hosted with the site.</p><button type="button" class="button button-olive" id="clear-shelf">Clear my saved teas ${icon('close')}</button><p id="privacy-status" role="status"></p><a class="underlined" href="/store-information.html">Read collection and privacy information</a></dialog><dialog id="image-dialog" class="image-dialog" aria-labelledby="image-title"><div class="lightbox-top"><h2 id="image-title"></h2><div><button data-image-zoom aria-label="Enlarge photo" aria-pressed="false">${icon('zoom')}</button><button data-close-dialog aria-label="Close photo viewer">${icon('close')}</button></div></div><div id="image-view" class="lightbox-view" tabindex="0" aria-label="Tea photo. Use left and right arrow keys to browse."></div><div class="lightbox-bottom"><button data-lightbox-step="-1" aria-label="Previous enlarged photo">${icon('left')}</button><span id="image-caption"></span><button data-lightbox-step="1" aria-label="Next enlarged photo">${icon('right')}</button></div></dialog><div id="toast" class="toast" role="status" aria-live="polite"></div>`;
  document.body.appendChild(shell);
  document.addEventListener('click',e=>{
    const save=e.target.closest('[data-save]');if(save)toggleSave(save.dataset.save);
    if(e.target.closest('[data-close-dialog]'))e.target.closest('dialog')?.close();
    if(e.target.closest('[data-open-search]')){renderSearch();openDialog($('#search-dialog'));$('#tea-search').focus();}
    if(e.target.closest('[data-open-shelf]')){renderShelf();openDialog($('#shelf-dialog'));}
    if(e.target.closest('[data-open-privacy]'))openDialog($('#privacy-dialog'));
    const menu=e.target.closest('.mobile-menu-button');if(menu){const nav=$('#mobile-nav');nav.hidden=!nav.hidden;menu.setAttribute('aria-expanded',String(!nav.hidden));menu.setAttribute('aria-label',nav.hidden?'Open navigation':'Close navigation');}
    if(e.target.closest('#mobile-nav a')){$('#mobile-nav').hidden=true;$('.mobile-menu-button').setAttribute('aria-expanded','false');}
    if(e.target.closest('#shelf-dialog a[href^="/#"]'))closeDialog($('#shelf-dialog'));
  });
  $$('dialog').forEach(dialog=>{
    dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const box=dialog.getBoundingClientRect();if(e.clientX<box.left||e.clientX>box.right||e.clientY<box.top||e.clientY>box.bottom)dialog.close();});
  });
  $('#tea-search').addEventListener('input',renderSearch);
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#mobile-nav').hidden){$('#mobile-nav').hidden=true;$('.mobile-menu-button').setAttribute('aria-expanded','false');$('.mobile-menu-button').focus();}});
  $('#clear-shelf').addEventListener('click',()=>{saved=[];syncSaved();$('#privacy-status').textContent='Your saved tea shelf has been cleared.';});
  document.addEventListener('ketli:saved',()=>{if($('#shelf-dialog').open)renderShelf();});
  window.addEventListener('storage',e=>{if(e.key!=='ketli-saved')return;try{saved=validateSaved(JSON.parse(e.newValue||'[]'));}catch{saved=[];}syncSaved();});
  syncSaved();mountCart();
}

function renderSearch() {
  const results=searchTeas($('#tea-search').value);
  $('#search-count').textContent=`${results.length} ${results.length===1?'tea':'teas'} found`;
  $('#search-results').innerHTML=results.length?results.map(t=>`<a class="search-result" href="${teaLink(t.id)}">${galleryImage(t,0)}<span><strong>${t.name}</strong><span>${t.type} / ${t.caffeine}</span></span>${icon('arrowUp')}</a>`).join(''):'<div class="empty-state"><h3>No cups like that just yet.</h3><p>Try “cinnamon”, “floral”, “ginger” or a tea name.</p><button class="underlined" id="reset-search">Show all six teas</button></div>';
  $('#reset-search')?.addEventListener('click',()=>{$('#tea-search').value='';renderSearch();$('#tea-search').focus();});
}
function renderShelf() {
  $('#shelf-items').innerHTML=saved.length?saved.map(id=>{const t=getTea(id);return `<article class="shelf-item"><a href="${teaLink(id)}">${galleryImage(t,0)}</a><div><h3><a href="${teaLink(id)}">${t.name}</a></h3><p>${t.type}</p><a class="underlined" href="${teaLink(id)}">Explore this tea</a></div><button data-save="${id}" aria-label="Remove ${t.name} from tea shelf">${icon('close')}</button></article>`;}).join(''):'<div class="empty-state">'+icon('cup')+'<h3>A shelf full of possibilities.</h3><p>Tap the heart on a tea to keep it here for your next visit.</p><a class="button button-olive" href="/#collection">Explore our teas '+icon('arrow')+'</a></div>';
  $('#shelf-actions').innerHTML=saved.length?'<button type="button" class="button button-outline" id="download-shelf">Download my tea list '+icon('share')+'</button>':'';
  $('#download-shelf')?.addEventListener('click',()=>{
    const content='KETLI TIME / YOUR TEA SHELF\n\n'+saved.map(id=>{const t=getTea(id);return `${t.name} — ${t.type}\nIngredients: ${t.ingredients.map(i=>i.name).join(', ')}\n${t.weight} g; ${money(t.price)} project-only\n${t.caffeine}; ${t.amount} / ${t.temp}°C / ${t.minutes} minutes\n${new URL(teaLink(id),location.origin).href}`;}).join('\n\n')+'\n\nAcademic marketing concept. No real order or payment.\n';
    const url=URL.createObjectURL(new Blob([content],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='ketli-time-my-tea-shelf.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Your tea list is ready.');
  });
}

let lightboxTea=null,lightboxIndex=0;
export function showImage(t,index=0) {lightboxTea=t;lightboxIndex=index;renderLightbox();openDialog($('#image-dialog'));$('#image-view').focus();}
function renderLightbox(){
  const t=lightboxTea;$('#image-title').textContent=`${t.name} / ${galleryViews[lightboxIndex].label}`;
  $('#image-view').innerHTML=galleryImage(t,lightboxIndex,{eager:true});$('#image-view').classList.remove('is-zoomed');
  $('#image-caption').textContent=`${lightboxIndex+1} / 6 · ${t.galleryCaptions[lightboxIndex]}`;
  $('[data-image-zoom]').setAttribute('aria-pressed','false');$('[data-image-zoom]').setAttribute('aria-label','Enlarge photo');
}
export function bindLightbox(){
  $$('[data-lightbox-step]').forEach(b=>b.addEventListener('click',()=>{lightboxIndex=(lightboxIndex+Number(b.dataset.lightboxStep)+6)%6;renderLightbox();}));
  $('#image-dialog').addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();lightboxIndex=(lightboxIndex+(e.key==='ArrowRight'?1:5))%6;renderLightbox();}});
  $('[data-image-zoom]').addEventListener('click',()=>{const active=$('#image-view').classList.toggle('is-zoomed');$('[data-image-zoom]').setAttribute('aria-pressed',String(active));$('[data-image-zoom]').setAttribute('aria-label',active?'Reduce photo':'Enlarge photo');});
  let startX=0,startY=0;$('#image-view').addEventListener('touchstart',e=>{startX=e.changedTouches[0].clientX;startY=e.changedTouches[0].clientY;},{passive:true});
  $('#image-view').addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-startX,dy=e.changedTouches[0].clientY-startY;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)&&!$('#image-view').classList.contains('is-zoomed')){lightboxIndex=(lightboxIndex+(dx<0?1:5))%6;renderLightbox();}},{passive:true});
}

export async function shareTea(t,button){
  const url=new URL(teaLink(t.id),location.origin).href;
  try{await navigator.clipboard.writeText(url);toast(`${t.name} link copied.`);if(button)button.setAttribute('data-copied','true');}
  catch{const fallback=$('#share-fallback');if(fallback){fallback.hidden=false;$('input',fallback).value=url;$('input',fallback).focus();$('input',fallback).select();toast('Copy the tea link from the field below.');}else toast('Copy this page’s address to share your tea.');}
}
