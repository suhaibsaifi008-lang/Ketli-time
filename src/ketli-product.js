import './ketli.css';
import { mountNaturalMotion, transitionGallery } from './ketli-motion.js';
import { teas,getTea,galleryViews,galleryImage,galleryPath,teaLink,money,conceptNote,storageNote } from './ketli-catalog.js';
import { $, $$,mountChrome,bindLightbox,icon,saveButton,productCard,showImage,shareTea,toast } from './ketli-common.js';
import { addButton } from './ketli-cart.js';
mountChrome();bindLightbox();
const tea=getTea(new URLSearchParams(location.search).get('tea'));let current=0;
if(!tea){
  document.title='Find your next tea | Ketli Time';
  $('#product-page').innerHTML=`<section class="not-found section"><p class="overline">A little change of plan</p><h1>Let’s find your next cup.</h1><p>Choose a tea to explore its blend, benefits and little kettle.</p><a class="button button-olive" href="/#collection">Explore all six teas</a><div class="tea-grid">${teas.map(t=>productCard(t)).join('')}</div></section>`;
}else{
  document.title=tea.name+' '+tea.type+' Blend | Ketli Time';
  $('meta[name="description"]').content=tea.intro;
  $('meta[property="og:title"]').content=document.title;
  $('meta[property="og:description"]').content=tea.intro;
  $('meta[property="og:image"]').content=new URL(galleryPath(tea)+'.webp',location.origin).href;
  const canonical=$('link[rel="canonical"]')||document.createElement('link');canonical.rel='canonical';canonical.href=new URL(teaLink(tea.id),location.origin).href;if(!canonical.parentNode)document.head.append(canonical);
  const next=teas[(teas.indexOf(tea)+1)%6],ingredients=tea.ingredients.map(i=>i.name).join(', ');
  $('#product-page').innerHTML=`
    <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><a href="/#collection">Our teas</a><span>/</span><span aria-current="page">${tea.name}</span><a class="next-tea" href="${teaLink(next.id)}">Next: ${next.name} ${icon('arrow')}</a></nav>
    <section class="product-intro" style="--tea:${tea.colour};--wash:${tea.wash}">
      <div class="product-gallery">
        <div class="gallery-stage" tabindex="0" aria-label="${tea.name} gallery. Use left and right arrow keys to change photo."><div id="gallery-image"></div><span class="gallery-badge" id="gallery-badge"></span><button class="gallery-zoom" id="gallery-zoom" aria-label="Enlarge current photo">${icon('zoom')}</button><div class="gallery-arrows"><button data-gallery-step="-1" aria-label="Previous tea photo">${icon('left')}</button><span id="gallery-count" aria-live="polite">1 / 6</span><button data-gallery-step="1" aria-label="Next tea photo">${icon('right')}</button></div></div>
        <p class="gallery-panel-title" id="gallery-panel-title" aria-live="polite">Meet the tea</p><div class="gallery-thumbnails" role="group" aria-label="${tea.name} photo views">${galleryViews.map((view,index)=>`<button type="button" data-gallery-index="${index}" aria-label="View ${view.label.toLowerCase()} photo" aria-pressed="${index===0}">${galleryImage(tea,index,{thumbnail:true})}<span>${view.label}</span></button>`).join('')}</div>
        <div class="gallery-caption"><p id="gallery-caption"></p><a id="download-panel" class="underlined" download>Download this image ${icon('share')}</a></div>
      </div>
      <div class="product-summary">
        <p class="overline">${tea.type} herbal blend</p><div class="product-title-row"><h1>${tea.name}</h1><span>${tea.meaning}</span></div>
        <h2>${tea.tagline}</h2><p class="product-intro-text">${tea.intro}</p>
        <div class="product-flavour-notes">${tea.notes.map(note=>`<span>${note}</span>`).join('')}</div>
        <p class="blend-summary"><strong>Inside the blend</strong> ${ingredients}.</p>

        <div class="product-facts"><div>${icon('leaf')}<span>Four botanicals<small>${tea.weight} g loose blend</small></span></div><div>${icon('cup')}<span>${tea.caffeine}<small>${tea.time}</small></span></div><div>${icon('clock')}<span>${tea.minutes} minute steep<small>${tea.amount} / ${tea.water} ml / ${tea.temp}°C</small></span></div></div>
        <div class="product-purchase"><div class="product-price"><strong>${money(tea.price)}</strong><span>50 g · Project-only price</span></div>${addButton(tea)}<p class="small">Academic shopping demo. No real order or payment.</p></div>
        <div class="product-save-box">${saveButton(tea,{full:true})}<button class="product-share" id="share-tea">${icon('share')} Share this tea</button><label id="share-fallback" hidden>Copy this tea link<input readonly aria-label="Tea share link"></label></div>

      </div>
    </section>
    <div class="product-sticky-tabs"><nav aria-label="Tea information"><a href="#why-this-tea">The story</a><a href="#what-it-offers">Ingredients & benefits</a><a href="#product-brewing">Brewing</a><a href="#product-label">Label & packaging</a></nav><span>${tea.name} / ${tea.type}</span></div>
    <section id="what-it-offers" class="section blend-details" style="--tea:${tea.colour};--wash:${tea.wash}">
      <div class="section-heading"><div><p class="overline">A closer look at your cup</p><h2>Inside ${tea.name}.</h2></div><p>A proposed recipe, chosen for flavour.<br>Every botanical has a part to play.</p></div>
      <div class="ingredient-grid">${tea.ingredients.map(i=>`<article><img src="/images/ketli-time/ingredients-v1/${i.image}.webp" alt="${i.name}" width="300" height="300" loading="lazy"><h3>${i.name}</h3><p>${i.note}</p></article>`).join('')}</div>
      <div class="benefits-editorial"><h3>Why make time<br>for ${tea.name}?</h3><div class="reason-list">${tea.benefits.map(([title,copy])=>`<div>${icon('check')}<span><h3>${title}</h3><p>${copy}</p></span></div>`).join('')}</div></div>
      <details class="concept-detail"><summary>About this blend concept</summary><p>${conceptNote} Benefits describe flavour and everyday enjoyment, not medical effects. ${tea.caution}</p></details>
    </section>
    <section id="why-this-tea" class="product-story section"><div><p class="overline">The ${tea.name} story</p><h2>${tea.meaning},<br>one cup at a time.</h2><p>${tea.story}</p><p class="story-pairing">${tea.pairing}</p></div></section>
    <section id="product-brewing" class="section product-brewing"><div class="section-heading"><div><p class="overline">A few minutes, just for you</p><h2>Make it your cup.</h2></div><p>Suggested brewing for the concept blend.<br>Adjust the next cup to your taste.</p></div><div class="product-brew-layout"><div class="product-brew-copy"><div class="brew-stats"><div><strong>${tea.amount}</strong><span>loose blend</span></div><div><strong>${tea.temp}°C</strong><span>fresh water</span></div><div><strong>${tea.minutes} min</strong><span>steep time</span></div></div><div class="brew-directions"><h3>The warm cup</h3><p>Add the blend to a roomy infuser. Pour over ${tea.water} ml water, cover and steep. ${tea.brew}</p><h3>Over ice</h3><p>${tea.iced}</p></div><a class="button button-outline" href="/#brewing">Use the brewing timer ${icon('clock')}</a></div></div></section>
    <section id="product-label" class="section product-label-section"><div class="section-heading"><div><p class="overline">Made to be read</p><h2>The label & little kettle.</h2></div><p>The same blend, clearly explained<br>on the front and the back.</p></div><div class="label-grid"><div class="label-art">${galleryImage(tea,4)}<button class="underlined" data-enlarge="4">Inspect front & back ${icon('zoom')}</button></div><div class="label-information"><h3>The ${tea.name} label</h3><dl><div><dt>Brand</dt><dd>Ketli Time</dd></div><div><dt>Blend</dt><dd>${tea.type} herbal infusion</dd></div><div><dt>Ingredients</dt><dd>${ingredients}</dd></div><div><dt>Net weight</dt><dd>50 g · Concept pack</dd></div><div><dt>Brew</dt><dd>${tea.amount} / ${tea.water} ml / ${tea.temp}°C / ${tea.minutes} minutes</dd></div><div><dt>Storage</dt><dd>${storageNote}</dd></div></dl><p class="small">Academic marketing concept. Proposed recipe and packaging, not a manufactured or certified product.</p></div></div><div class="unboxing-row"><div><p class="overline">A kettle, made of paper</p><h3>Made of paper. Made to keep.</h3><p>A faceted paperboard body, a carry handle and an angular spout make the outer carton. A separate sealed food-safe pouch is proposed for the blend.</p><ul class="plain-list"><li>Ingredient-coloured handle, borders and sides</li><li>A cream botanical label, front and back</li><li>A separate sealed pouch inside</li><li>Keep the outer carton dry; never pour water into it</li></ul><button class="underlined" data-enlarge="5">Look inside the kettle ${icon('zoom')}</button></div></div></section>
    <section class="section related-section"><div class="section-heading"><div><p class="overline">Another kind of moment</p><h2>Meet the rest of the collection.</h2></div><a class="underlined" href="/#collection">All six teas ${icon('arrow')}</a></div><div class="tea-grid">${teas.filter(t=>t.id!==tea.id).slice(0,3).map(t=>productCard(t)).join('')}</div></section>
    <div class="mobile-product-save"><span><strong>${tea.name}</strong><small>50 g · ${money(tea.price)} demo</small></span>${addButton(tea)}</div>`;
  function select(index){
    current=(index+6)%6;transitionGallery($('#gallery-image'),galleryImage(tea,current,{eager:true}));$('#gallery-count').textContent=(current+1)+' / 6';$('#gallery-caption').textContent=tea.galleryCaptions[current];$('#gallery-badge').textContent=galleryViews[current].label;$('#gallery-panel-title').textContent=galleryViews[current].label;$('.gallery-stage').dataset.view=String(current);
    $$('[data-gallery-index]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.galleryIndex)===current)));
    $('#download-panel').href=galleryPath(tea,current)+'.png';$('#download-panel').download=tea.name+'-'+galleryViews[current].id+'.png';
  }
  $$('[data-gallery-index]').forEach(b=>b.addEventListener('click',()=>select(Number(b.dataset.galleryIndex))));
  $$('[data-gallery-step]').forEach(b=>b.addEventListener('click',()=>select(current+Number(b.dataset.galleryStep))));
  $('.gallery-stage').addEventListener('keydown',event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();select(current+(event.key==='ArrowRight'?1:-1));}});
  let x=0,y=0;$('.gallery-stage').addEventListener('touchstart',e=>{x=e.changedTouches[0].clientX;y=e.changedTouches[0].clientY;},{passive:true});$('.gallery-stage').addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-x,dy=e.changedTouches[0].clientY-y;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy))select(current+(dx<0?1:-1));},{passive:true});
  $('#gallery-zoom').addEventListener('click',()=>showImage(tea,current));
  $$('[data-enlarge]').forEach(b=>b.addEventListener('click',()=>showImage(tea,Number(b.dataset.enlarge))));
  $('#share-tea').addEventListener('click',()=>shareTea(tea,$('#share-tea')));
  $('#gallery-image').addEventListener('ketli:image-error',()=>toast('That image could not load. Try another view.'));
  select(0);
}

const disposeMotion=mountNaturalMotion();
if(import.meta.hot)import.meta.hot.dispose(disposeMotion);
