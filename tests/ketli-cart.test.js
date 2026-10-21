import test from 'node:test';
import assert from 'node:assert/strict';
import { validateCart,cartTotal,cartKey } from '../src/ketli-cart.js';
import { teas,searchTeas,galleryViews } from '../src/ketli-catalog.js';
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

test('demo cart ignores malformed, retired and out-of-range rows',()=>{
  assert.deepEqual(validateCart(null),[]);
  assert.deepEqual(validateCart([null,{id:'sunehri',quantity:1},{id:'mehak',quantity:0},{id:'mehak',quantity:11},{id:'aanch',quantity:1.5},{id:'rahat',quantity:'2'},{id:'roohani',quantity:2}]),[{id:'roohani',quantity:2}]);
  assert.equal(cartKey,'ketli-demo-cart-v1');
});
test('cart merges duplicates without exceeding ten and prices come from the catalogue',()=>{
  const rows=validateCart([{id:'mehak',quantity:8},{id:'mehak',quantity:4},{id:'aanch',quantity:2,price:1}]);
  assert.deepEqual(rows,[{id:'mehak',quantity:10},{id:'aanch',quantity:2}]);
  assert.equal(cartTotal(rows),3588);assert.equal(cartTotal([]),0);assert.equal(cartTotal([{id:'mehak',quantity:2},{id:'roohani',quantity:1}]),897);
});
test('every four-ingredient recipe is searchable and has six 1200px authored masters',async()=>{
  for(const tea of teas){
    assert.equal(new Set(tea.ingredients.map(i=>i.name)).size,4);
    for(const ingredient of tea.ingredients)assert.ok(searchTeas(ingredient.name).some(t=>t.id===tea.id));
    for(const view of galleryViews){
      const meta=await sharp(fileURLToPath(new URL('../public/images/ketli-time/stories-v1/'+tea.id+'-'+view.id+'.png',import.meta.url))).metadata();
      assert.equal(meta.width,1200);assert.equal(meta.height,1200);
    }
  }
});
