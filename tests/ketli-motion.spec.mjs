import { test,expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test.use({viewport:{width:1440,height:900}});

test('portrait hero and mobile gallery are usable by touch and keyboard',async({browser})=>{
  const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
  const page=await context.newPage();await page.goto('http://127.0.0.1:5180/',{waitUntil:'networkidle'});
  await expect(page.locator('.hero-portrait')).toBeVisible();
  await expect(page.locator('#open-3d,#model-dialog')).toHaveCount(0);
  const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  expect(result.violations.map(v=>v.id)).toEqual([]);
  await page.goto('http://127.0.0.1:5180/tea.html?tea=mehak',{waitUntil:'networkidle'});
  await page.locator('[data-gallery-index="5"]').click();
  await expect(page.locator('#gallery-panel-title')).toHaveText('The little kettle');
  await expect(page.locator('#gallery-image> .gallery-frame img')).toHaveAttribute('src',/mehak-packaging.webp/);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await context.close();
});

test('photo entrances have visible fade feedback and finish fully opaque',async({page})=>{
  await page.goto('/',{waitUntil:'networkidle'});
  const photo=page.locator('#collection-grid .gallery-frame').first();
  expect(await photo.evaluate(el=>Number(getComputedStyle(el).opacity))).toBeCloseTo(.35,2);
  await photo.scrollIntoViewIfNeeded();
  await expect.poll(()=>photo.evaluate(el=>Number(getComputedStyle(el).opacity))).toBe(1);
  expect(await page.locator('#collection h2').evaluate(el=>getComputedStyle(el).opacity)).toBe('1');
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect.poll(()=>page.locator('#collection-grid .gallery-frame').last().evaluate(el=>Number(getComputedStyle(el).opacity))).toBe(1);
});

test('short and enlarged mobile screens expand instead of hiding content',async({page})=>{
  await page.setViewportSize({width:320,height:568});
  await page.goto('/',{waitUntil:'networkidle'});
  await page.addStyleTag({content:'.hero-story{font-size:200%}.brand-hero .hero-intro{font-size:24px}'});
  const clear=await page.locator('.brand-hero').evaluate(el=>{
    const a=el.querySelector('.hero-actions').getBoundingClientRect(),i=el.querySelector('.hero-portrait img').getBoundingClientRect();
    return i.top>=a.bottom&&i.bottom<=el.getBoundingClientRect().bottom&&document.documentElement.scrollWidth<=innerWidth;
  });
  expect(clear).toBe(true);
});

test('botanical pattern stays behind solid reading surfaces',async({page})=>{
  await page.goto('/');
  await expect(page.locator('#collection')).toHaveClass(/botanical-surface/);
  expect(await page.locator('#collection').evaluate(el=>{const s=getComputedStyle(el,'::before');return s.backgroundImage.includes('botanical-pattern')&&Number(s.opacity)>=.5&&s.pointerEvents==='none'&&s.zIndex==='-1';})).toBe(true);
  for(const selector of ['#collection .section-heading','#collection .tea-card','#brewing .section-heading'])expect(await page.locator(selector).first().evaluate(el=>getComputedStyle(el).backgroundColor)).toBe('rgb(251, 248, 240)');
  expect((await page.request.get('/images/ketli-time/botanical-pattern.svg')).status()).toBe(200);
  await page.goto('/demo-checkout.html');await expect(page.locator('.botanical-surface')).toHaveCount(0);
});
test('scroll and hover move only photos within the agreed limits',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/',{waitUntil:'networkidle'});
  await page.locator('#collection-grid .tea-card-visual').first().hover();
  await expect.poll(()=>page.locator('#collection-grid .gallery-frame').first().evaluate(el=>Math.abs(new DOMMatrixReadOnly(getComputedStyle(el).transform).m13))).toBeGreaterThan(.01);
  const tilt=await page.locator('#collection-grid .gallery-frame').first().evaluate(el=>{const m=new DOMMatrixReadOnly(getComputedStyle(el).transform);return Math.abs(Math.asin(m.m13)*180/Math.PI);});
  expect(tilt).toBeLessThanOrEqual(1.51);expect(await page.locator('#collection-grid .tea-card-heading').first().evaluate(el=>getComputedStyle(el).transform)).toBe('none');
  await page.mouse.move(5,5);await page.locator('[data-filter=floral]').click();await expect(page.locator('#collection-grid .tea-card')).toHaveCount(2);
  await page.locator('[data-filter=all]').click();await page.locator('#collection-grid .tea-card-visual').first().hover();
  await expect.poll(()=>page.locator('#collection-grid [data-natural-photo]').count()).toBe(6);
  await page.evaluate(()=>scrollTo(0,350));await page.waitForTimeout(650);
  const hero=await page.locator('.hero-landscape img').evaluate(el=>Math.abs(new DOMMatrixReadOnly(getComputedStyle(el).transform).m42));expect(hero).toBeLessThanOrEqual(10.01);expect(hero).toBeGreaterThan(0);
  await page.locator('#packaging').scrollIntoViewIfNeeded();await page.waitForTimeout(650);
  const packaging=await page.locator('#packaging-photo>.gallery-frame').evaluate(el=>{const box=el.getBoundingClientRect(),p=el.parentElement.getBoundingClientRect();return {y:Math.abs(new DOMMatrixReadOnly(getComputedStyle(el).transform).m42),contained:box.top>=p.top&&box.bottom<=p.bottom};});
  expect(packaging.y).toBeLessThanOrEqual(7.01);expect(packaging.contained).toBe(true);
  await page.locator('[data-pack-detail=label]').click();await expect(page.locator('#packaging-photo [data-natural-photo]')).toHaveCount(0);
  expect(errors).toEqual([]);
});
test('runtime reduced motion removes transforms and gallery fades',async({page})=>{
  await page.goto('/tea.html?tea=mehak',{waitUntil:'networkidle'});
  await page.locator('.related-section .tea-card-visual').first().hover();
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect.poll(()=>page.locator('[data-natural-photo]').count()).toBe(0);
  expect(await page.locator('.related-section .gallery-frame').first().evaluate(el=>getComputedStyle(el).transform)).toBe('none');
  await page.locator('[data-gallery-index]').nth(1).click();
  await expect(page.locator('#gallery-image> .gallery-frame img')).toHaveAttribute('src',/mehak-botanical.webp/);
  await expect(page.locator('.gallery-crossfade')).toHaveCount(0);
  await page.emulateMedia({reducedMotion:'no-preference'});
  await expect.poll(()=>page.locator('[data-natural-photo]').count()).toBeGreaterThan(0);
});
test('fast gallery changes keep a decoded latest image and a stable frame',async({page})=>{
  await page.goto('/tea.html?tea=roohani',{waitUntil:'networkidle'});
  const height=await page.locator('.gallery-stage').evaluate(el=>el.getBoundingClientRect().height);
  for(const index of [1,4,2,5])await page.locator('[data-gallery-index]').nth(index).click();
  await expect(page.locator('#gallery-image> .gallery-frame img')).toHaveAttribute('src',/roohani-packaging.webp/);
  await expect(page.locator('#gallery-image> .gallery-frame img')).toHaveJSProperty('complete',true);
  await expect.poll(()=>page.locator('.gallery-crossfade').count()).toBe(0);
  expect(await page.locator('.gallery-stage').evaluate(el=>el.getBoundingClientRect().height)).toBeCloseTo(height,0);
  expect(await page.locator('#gallery-image').evaluate(el=>getComputedStyle(el).transform)).toBe('none');
});
test('mobile has no hover tilt or photographic parallax',async({browser})=>{
  const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
  const page=await context.newPage();await page.goto('http://127.0.0.1:5180/',{waitUntil:'networkidle'});
  await page.evaluate(()=>scrollTo(0,500));await page.waitForTimeout(650);
  expect(await page.locator('.hero-landscape img').evaluate(el=>getComputedStyle(el).transform)).toBe('none');
  await page.locator('#packaging').scrollIntoViewIfNeeded();
  expect(await page.locator('#packaging-photo>.gallery-frame').evaluate(el=>getComputedStyle(el).transform)).toBe('none');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await context.close();
});
