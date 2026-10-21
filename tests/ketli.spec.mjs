import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { teas, galleryViews } from '../src/ketli-catalog.js';

test.use({viewport:{width:1440,height:1000}});
async function readyForScreenshot(page){await page.evaluate(async()=>{const images=[...document.images];images.forEach(image=>image.loading='eager');await Promise.all(images.map(image=>image.decode()));await document.fonts.ready;});}
test('photographic hero, six teas and collection filters',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/',{waitUntil:'domcontentloaded'});
  await expect(page.locator('.hero-desktop-heading')).toHaveText('Rooted in nature.Made for your everyday.');
  await expect(page.locator('#collection-grid .tea-card')).toHaveCount(6);
  await expect(page.locator('.hero-landscape>picture>img')).toHaveJSProperty('naturalWidth',1536);
  await page.getByRole('button',{name:'Flowers & fruit notes',exact:true}).click();await expect(page.locator('#collection-grid .tea-card')).toHaveCount(2);
  await page.getByRole('button',{name:'Peppery & bold',exact:true}).click();await expect(page.locator('#collection-grid .tea-card')).toHaveCount(1);
  await page.locator('[data-filter=all]').click();
  await expect(page.locator('.hero-landscape>picture>img')).toHaveAttribute('src','/images/ketli-time/hero-panorama-v1.webp');
  await readyForScreenshot(page);await page.screenshot({path:'test-results/ketli-v2-desktop-hero.png'});await page.screenshot({path:'test-results/ketli-v2-desktop-home.png',fullPage:true});
  expect(errors).toEqual([]);
});
for(const tea of teas){
  test(tea.name+': every photo, keyboard gallery, zoom, content and share',async({page})=>{
    const errors=[];const badResponses=[];
    page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)badResponses.push(r.url());});
    await page.goto('/tea.html?tea='+tea.id,{waitUntil:'domcontentloaded'});
    await expect(page.locator('h1')).toHaveText(tea.name);
    await expect(page).toHaveTitle(new RegExp(tea.name));
    await expect(page.locator('.gallery-thumbnails button')).toHaveCount(6);
    for(let i=0;i<6;i++){
      await page.locator('[data-gallery-index="'+i+'"]').click();
      await expect(page.locator('#gallery-count')).toHaveText((i+1)+' / 6');
      await expect(page.locator('#gallery-caption')).toHaveText(tea.galleryCaptions[i]);
      const selected=page.locator('#gallery-image > .gallery-frame img');
      await expect(selected).toHaveAttribute('src',new RegExp(tea.id+'-'+galleryViews[i].id+'\\.webp'));
      await expect(selected).toHaveJSProperty('complete',true);expect(await selected.evaluate(image=>image.naturalWidth)).toBeGreaterThan(0);
    }
    await page.locator('.gallery-stage').focus();await page.keyboard.press('ArrowRight');await expect(page.locator('#gallery-count')).toHaveText('1 / 6');
    await page.locator('#gallery-zoom').click();await expect(page.locator('#image-dialog')).toBeVisible();
    await page.keyboard.press('ArrowRight');await expect(page.locator('#image-title')).toContainText('Inside the blend');
    await page.locator('[data-image-zoom]').click();await expect(page.locator('#image-view')).toHaveClass(/is-zoomed/);
    await page.keyboard.press('Escape');await expect(page.locator('#image-dialog')).not.toBeVisible();
    for(const item of tea.ingredients)await expect(page.locator('#what-it-offers')).toContainText(item.name);
    for(const [benefit] of tea.benefits)await expect(page.locator('#what-it-offers')).toContainText(benefit);
    await expect(page.locator('#product-label')).toContainText(tea.botanical);
    await page.evaluate(()=>{Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw Error('denied');}}});});
    await page.locator('#share-tea').click();await expect(page.locator('#share-fallback')).toBeVisible();
    await expect(page.locator('#share-fallback input')).toHaveValue(new RegExp('tea='+tea.id));
    if(tea.id==='mehak'){await readyForScreenshot(page);await page.screenshot({path:'test-results/ketli-v2-product-desktop.png',fullPage:true});}
    expect(errors).toEqual([]);expect(badResponses).toEqual([]);
  });
}
test('saved tea shelf persists, downloads, removes and clears',async({page})=>{
  await page.goto('/',{waitUntil:'domcontentloaded'});
  await page.locator('#collection-grid [data-save=mehak]').click();
  await page.locator('#collection-grid [data-save=sukoon]').click();
  await expect(page.locator('[data-saved-count]')).toHaveText('2');
  await page.reload({waitUntil:'domcontentloaded'});await expect(page.locator('[data-saved-count]')).toHaveText('2');
  await page.locator('[data-open-shelf]').click();await expect(page.locator('.shelf-item')).toHaveCount(2);
  const download=page.waitForEvent('download');await page.locator('#download-shelf').click();expect((await download).suggestedFilename()).toBe('ketli-time-my-tea-shelf.txt');
  await page.locator('#shelf-items [data-save=mehak]').click();await expect(page.locator('.shelf-item')).toHaveCount(1);
  await page.keyboard.press('Escape');await page.locator('[data-open-privacy]').click();await page.locator('#clear-shelf').click();await expect(page.locator('#privacy-status')).toContainText('cleared');await page.keyboard.press('Escape');
  await expect(page.locator('[data-saved-count]')).toHaveText('0');
});
test('search, no-result recovery and botanical tea finder',async({page})=>{
  await page.goto('/',{waitUntil:'domcontentloaded'});await page.locator('[data-open-search]').click();await page.locator('#tea-search').fill('cinnamon');
  await expect(page.locator('#search-results .search-result')).toHaveCount(2);await expect(page.locator('#search-results')).toContainText('Taazgi');
  await page.locator('#tea-search').fill('not-a-tea');await expect(page.locator('#search-results')).toContainText('No cups');
  await page.locator('#reset-search').click();await expect(page.locator('#search-results .search-result')).toHaveCount(6);await page.keyboard.press('Escape');
  await page.locator('input[name=moment][value=bright]').check();
  await page.locator('#finder-form button[type=submit]').click();await expect(page.locator('.finder-result-heading h3')).toHaveText('Roohani');
  await page.locator('#finder-reset').click();await expect(page.locator('#finder-result')).toBeEmpty();
});
test('brewing mode, timer completion and cancellation',async({page})=>{
  await page.clock.install();await page.goto('/',{waitUntil:'domcontentloaded'});
  await page.selectOption('#brew-select','rahat');await expect(page.locator('#brew-stats')).toContainText('7 min');
  await page.locator('[data-brew-mode=iced]').click();await expect(page.locator('#brew-serving')).toContainText('ice');
  await page.locator('#start-timer').click();await expect(page.locator('#timer-display')).toHaveText('7:00');
  await page.clock.fastForward(420000);await expect(page.locator('#timer-status')).toContainText('ready');
  await page.locator('#start-timer').click();await page.locator('#cancel-timer').click();await expect(page.locator('#timer-status')).toContainText('cancelled');
  await page.locator('#start-timer').click();await page.selectOption('#brew-select','mehak');await expect(page.locator('#timer-display')).toBeEmpty();await expect(page.locator('#start-timer')).toBeEnabled();
});
test('packaging details work without the retired 3D explorer',async({page})=>{
  await page.goto('/',{waitUntil:'domcontentloaded'});await expect(page.locator('#kettle-view canvas')).toHaveCount(0);
  await page.locator('[data-pack-detail=inside]').click();await expect(page.locator('#packaging-explanation')).toContainText('food-safe pouch');
  await page.locator('[data-pack-detail=label]').click();await expect(page.locator('#packaging-explanation')).toContainText('batch');
  await expect(page.locator('#open-3d,#model-dialog')).toHaveCount(0);
  await page.locator('[data-pack-detail=outside]').click();await expect(page.locator('#packaging-explanation')).toContainText('decorative outer packaging');
});
test('mobile at 390 and 320 pixels: navigation, shelf and six-view gallery',async({page})=>{
  await page.setViewportSize({width:390,height:844});await page.goto('/',{waitUntil:'domcontentloaded'});
  await page.locator('.mobile-menu-button').click();await expect(page.locator('#mobile-nav')).toBeVisible();await page.locator('#mobile-nav a').first().click();await expect(page.locator('#mobile-nav')).toBeHidden();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await readyForScreenshot(page);await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:'test-results/ketli-v2-mobile-hero.png'});await page.screenshot({path:'test-results/ketli-v2-mobile-home.png',fullPage:true});
  await page.goto('/tea.html?tea=mehak',{waitUntil:'domcontentloaded'});
  await page.locator('[data-gallery-index="4"]').click();await expect(page.locator('#gallery-count')).toHaveText('5 / 6');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await readyForScreenshot(page);await page.screenshot({path:'test-results/ketli-v2-mobile-product.png',fullPage:true});
  await page.setViewportSize({width:320,height:720});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.goto('/',{waitUntil:'domcontentloaded'});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
test('unknown tea, corrupt storage and reduced motion remain usable',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});await page.addInitScript(()=>{localStorage.setItem('ketli-saved','{invalid');});
  await page.goto('/tea.html?tea=unknown',{waitUntil:'domcontentloaded'});await expect(page.locator('h1')).toHaveText('Let’s find your next cup.');
  await page.goto('/',{waitUntil:'domcontentloaded'});await expect(page.locator('#collection-grid .tea-card')).toHaveCount(6);
  await expect(page.locator('[data-saved-count]')).toHaveText('0');
});
test('responsive hero keeps photography and actions clear without clipping',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/',{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  for(const [width,height] of [[320,568],[360,740],[390,844],[430,932],[600,800],[768,1024],[1024,768],[1280,720],[1440,900],[1920,768]]){
    await page.setViewportSize({width,height});await page.waitForTimeout(120);
    const geometry=await page.locator('.brand-hero').evaluate(el=>{
      const hero=el.getBoundingClientRect(),action=el.querySelector('.hero-actions').getBoundingClientRect();
      const portrait=getComputedStyle(el.querySelector('.hero-portrait')).display!=='none';
      const image=el.querySelector(portrait?'.hero-portrait img':'.hero-landscape img'),photo=image.getBoundingClientRect();
      const state={portrait,bottom:hero.bottom,loaded:image.naturalWidth>0,overflow:document.documentElement.scrollWidth>innerWidth,actionClear:action.bottom<=photo.top,contained:photo.left>=0&&photo.right<=innerWidth&&photo.bottom<=hero.bottom};
      if(!portrait){
        const scale=Math.max(photo.width/image.naturalWidth,photo.height/image.naturalHeight);
        const handleRatio=image.naturalWidth/image.naturalHeight>2?384/821:467/1024;
        const handles=photo.top+image.naturalHeight*handleRatio*scale+(photo.height-image.naturalHeight*scale);
        state.actionClear=action.bottom+16<=handles;
        state.contained=Math.abs(photo.width-hero.width)<1&&Math.abs(photo.height-hero.height)<1;
      }
      return state;
    });
    expect(geometry.loaded).toBe(true);expect(geometry.overflow).toBe(false);
    expect(geometry.actionClear,JSON.stringify({width,height,geometry})).toBe(true);
    expect(geometry.contained).toBe(true);
    // Short windows expand naturally; normal phones keep the opening within one screen.
    if(height>=740||!geometry.portrait)expect(geometry.bottom).toBeLessThanOrEqual(height+1);
  }
  await page.setViewportSize({width:390,height:844});
  await expect(page.locator('.hero-phone-heading')).toBeVisible();
  await expect(page.locator('.hero-mobile-teas')).toHaveCount(0);
  await page.screenshot({path:'test-results/hero-photo-mobile.png'});
});

test('corrected brand appears throughout pages and preserves an existing saved shelf',async({page})=>{
  await page.addInitScript(()=>{
    if(!localStorage.getItem('ketli-saved'))localStorage.setItem('kateli-saved','["mehak","sukoon"]');
  });
  await page.goto('/',{waitUntil:'domcontentloaded'});
  await expect(page).toHaveTitle(/Ketli Time/);
  await expect(page.locator('[data-saved-count]')).toHaveText('2');
  expect(await page.evaluate(()=>localStorage.getItem('kateli-saved'))).toBeNull();
  await expect(page.locator('.brand img')).toHaveAttribute('src','/images/ketli-time/wordmark.webp');
  expect(await page.locator('body').innerText()).not.toMatch(/kateli|ketli\s+times/i);
  await page.locator('[data-open-search]').click();
  expect(await page.locator('#search-dialog').innerText()).not.toMatch(/kateli|ketli\s+times/i);
  await page.keyboard.press('Escape');
  for(const tea of teas){
    await page.goto('/tea.html?tea='+tea.id,{waitUntil:'domcontentloaded'});
    await expect(page).toHaveTitle(new RegExp(tea.name+'.*Ketli Time'));
    expect(await page.locator('body').innerText()).not.toMatch(/kateli|ketli\s+times/i);
    await expect(page.locator('#gallery-image > .gallery-frame img')).toHaveAttribute('src',new RegExp('/images/ketli-time/stories-v1/'+tea.id));
  }
});
test('automated accessibility checks on homepage, product and search',async({page})=>{
  await page.goto('/',{waitUntil:'domcontentloaded'});await page.evaluate(()=>document.fonts.ready);
  const home=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(home.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
  await page.locator('[data-open-search]').click();await page.locator('#search-dialog').evaluate(el=>Promise.all(el.getAnimations().map(animation=>animation.finished)));const search=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(search.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
  await page.keyboard.press('Escape');await page.goto('/tea.html?tea=mehak',{waitUntil:'domcontentloaded'});
  const product=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(product.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
});

test('demo bag adds, persists, edits quantities and removes products',async({page})=>{
  await page.goto('/');
  await page.locator('#collection-grid [data-add-tea=mehak]').click({clickCount:2});
  await page.locator('#collection-grid [data-add-tea=roohani]').click();
  await expect(page.locator('[data-cart-count]')).toHaveText('3');
  await page.reload();await expect(page.locator('[data-cart-count]')).toHaveText('3');
  await page.locator('[data-open-cart]').click();
  await expect(page.locator('#cart-dialog .cart-item')).toHaveCount(2);
  await expect(page.locator('#cart-dialog .cart-total')).toContainText('₹897');
  await page.getByRole('button',{name:'Increase Mehak quantity',exact:true}).click();
  await expect(page.locator('#cart-dialog .cart-total')).toContainText('₹1,196');
  await page.getByRole('button',{name:'Remove Roohani from bag',exact:true}).click();
  await expect(page.locator('#cart-dialog .cart-total')).toContainText('₹897');
  await page.locator('[data-cart-clear]').click();
  await expect(page.locator('#cart-content')).toContainText('A little room for tea');
});
test('restock page preserves selections and requests no payment or personal data',async({page})=>{
  const mutations=[];page.on('request',request=>{if(!['GET','HEAD'].includes(request.method()))mutations.push(request.url());});
  await page.goto('/tea.html?tea=aanch');
  await page.locator('.product-purchase [data-add-tea]').click();
  await page.locator('[data-open-cart]').click();
  await page.locator('.checkout-link').click();
  await expect(page).toHaveURL(/demo-checkout.html/);
  await expect(page.locator('h1')).toHaveText('We’re restocking soon.');
  await expect(page).toHaveTitle('Restocking soon | Ketli Time');
  await expect(page.locator('#checkout-page input')).toHaveCount(0);
  await expect(page.locator('#checkout-page')).toContainText('Restock notification sign-ups are coming soon.');
  await expect(page.locator('#complete-demo')).toHaveCount(0);
  await page.reload();await expect(page.locator('[data-cart-count]')).toHaveText('1');
  await expect(page.locator('#checkout-page')).not.toContainText(/demo order|demo total|demo delivery/i);
  expect(JSON.parse(await page.evaluate(()=>localStorage.getItem('ketli-demo-cart-v1')))).toEqual([{id:'aanch',quantity:1}]);
  expect(mutations).toEqual([]);
  await page.locator('#checkout-page [data-cart-remove]').click();await expect(page.locator('.checkout-layout')).toHaveCount(0);
  await page.reload();await expect(page.locator('h1')).toHaveText('We’re restocking soon.');
});
test('cart caps quantities, rejects stale data and leaves favourites separate',async({page})=>{
  await page.addInitScript(()=>{
    localStorage.setItem('ketli-demo-cart-v1',JSON.stringify([{id:'mehak',quantity:10},{id:'sunehri',quantity:2},{id:'rahat',quantity:-3}]));
    localStorage.setItem('ketli-saved','["sukoon"]');
  });
  await page.goto('/');await expect(page.locator('[data-cart-count]')).toHaveText('10');
  await page.locator('#collection-grid [data-add-tea=mehak]').click();
  await expect(page.locator('#toast')).toContainText('up to 10');
  await expect(page.locator('[data-saved-count]')).toHaveText('1');
  await page.locator('[data-open-cart]').click();
  await expect(page.getByRole('button',{name:'Increase Mehak quantity',exact:true})).toBeDisabled();
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-open-cart]')).toBeFocused();
});
test('shopping still works when browser storage is unavailable',async({page})=>{
  await page.addInitScript(()=>{Storage.prototype.getItem=()=>{throw Error('blocked');};Storage.prototype.setItem=()=>{throw Error('blocked');};});
  await page.goto('/');await page.locator('#collection-grid [data-add-tea=mehak]').click();
  await expect(page.locator('[data-cart-count]')).toHaveText('1');
  await expect(page.locator('#toast')).toContainText('this visit only');
});
test('demo checkout and cart pass automated accessibility checks',async({page})=>{
  await page.goto('/');await page.locator('#collection-grid [data-add-tea=mehak]').click();await page.locator('[data-open-cart]').click();
  const cart=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(cart.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
  await page.locator('.checkout-link').click();
  const checkout=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(checkout.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
});
