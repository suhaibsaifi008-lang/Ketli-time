import { getTea, galleryImage, money } from './ketli-catalog.js';
export const cartKey='ketli-demo-cart-v1';
export function validateCart(value){
  if(!Array.isArray(value))return [];
  const result=new Map();
  for(const row of value){
    if(!row||!getTea(row.id)||!Number.isInteger(row.quantity)||row.quantity<1||row.quantity>10)continue;
    result.set(row.id,{id:row.id,quantity:Math.min(10,(result.get(row.id)?.quantity||0)+row.quantity)});
  }
  return [...result.values()];
}
export const cartTotal=rows=>validateCart(rows).reduce((sum,row)=>sum+getTea(row.id).price*row.quantity,0);
let rows=[],persistent=true;
try{if(typeof localStorage!=='undefined')rows=validateCart(JSON.parse(localStorage.getItem(cartKey)||'[]'));}catch{persistent=false;}
export const getCart=()=>rows.map(row=>({...row}));
export const addButton=(tea,extra='')=>`<button type="button" class="button button-olive add-tea ${extra}" data-add-tea="${tea.id}" aria-label="Add ${tea.name} to demo cart">Add to bag <span>${money(tea.price)}</span></button>`;
function update(){
  try{localStorage.setItem(cartKey,JSON.stringify(rows));persistent=true;}catch{persistent=false;}
  document.dispatchEvent(new CustomEvent('ketli:cart'));
}
export function addTea(id){
  if(!getTea(id))return false;
  const row=rows.find(row=>row.id===id);
  if(row?.quantity===10)return false;
  if(row)row.quantity++;else rows.push({id,quantity:1});
  update();return true;
}
export function setQuantity(id,quantity){
  if(!Number.isInteger(quantity)||quantity<0||quantity>10||!getTea(id))return;
  rows=rows.flatMap(row=>row.id===id?(quantity?[{id,quantity}]:[]):[row]);update();
}
export function clearCart(){rows=[];update();}
export function cartLines(){
  return rows.map(({id,quantity})=>{
    const tea=getTea(id);
    return `<article class="cart-item" data-cart-item="${id}"><a href="/tea.html?tea=${id}" aria-label="Explore ${tea.name}">${galleryImage(tea,0,{thumbnail:true})}</a><div><h3>${tea.name}</h3><p>${tea.type} blend · ${tea.weight} g</p><strong>${money(tea.price*quantity)}</strong><div class="quantity-controls"><button type="button" data-cart-quantity="${quantity-1}" data-cart-id="${id}" aria-label="Decrease ${tea.name} quantity">−</button><span aria-label="${tea.name} quantity">${quantity}</span><button type="button" data-cart-quantity="${quantity+1}" data-cart-id="${id}" aria-label="Increase ${tea.name} quantity" ${quantity===10?'disabled':''}>+</button></div></div><button type="button" data-cart-remove="${id}" aria-label="Remove ${tea.name} from bag">Remove</button></article>`;
  }).join('');
}
export function mountCart(){
  const dialog=document.createElement('dialog');dialog.id='cart-dialog';dialog.className='cart-dialog';dialog.setAttribute('aria-labelledby','cart-title');
  dialog.innerHTML='<button type="button" class="dialog-close" data-close-dialog aria-label="Close shopping bag">×</button><p class="overline">Your little collection</p><h2 id="cart-title" tabindex="-1">The tea bag.</h2><p class="cart-disclosure">Academic shopping demo · No real orders</p><div id="cart-content"></div><p id="cart-status" role="status"></p>';
  document.body.append(dialog);
  const render=()=>{
    document.querySelectorAll('[data-cart-count]').forEach(node=>node.textContent=String(rows.reduce((n,row)=>n+row.quantity,0)));
    const content=document.querySelector('#cart-content');if(!content)return;
    content.innerHTML=rows.length?cartLines()+`<div class="cart-total"><span>Subtotal</span><strong>${money(cartTotal(rows))}</strong></div><p class="small">50 g concept packs · Project-only prices. Our next batch is coming soon.</p><a class="button button-olive checkout-link" href="/demo-checkout.html">Restock updates <span>↗</span></a><button type="button" class="underlined" data-cart-clear>Empty bag</button>`:'<div class="empty-state"><h3>A little room for tea.</h3><p>Choose a blend to begin your collection.</p><a class="button button-olive" href="/#collection">Explore the six teas</a></div>';
  };
  document.addEventListener('click',event=>{
    const add=event.target.closest('[data-add-tea]'),open=event.target.closest('[data-open-cart]');
    if(add){const tea=getTea(add.dataset.addTea),ok=addTea(add.dataset.addTea);const status=document.querySelector('#toast');if(status){status.textContent=ok?tea.name+' added to your bag.'+(persistent?'':' Saved for this visit only.'):'You can add up to 10 packs of each tea.';status.classList.add('is-visible');setTimeout(()=>status.classList.remove('is-visible'),3000);}add.dataset.added=ok?'true':'false';}
    if(open){render();if(!dialog.open)dialog.showModal();}
    const quantity=event.target.closest('[data-cart-quantity]');
    if(quantity){const id=quantity.dataset.cartId,action=quantity.getAttribute('aria-label');setQuantity(id,Number(quantity.dataset.cartQuantity));document.querySelector('[data-cart-item="'+id+'"] button[aria-label="'+action+'"]')?.focus();}
    const remove=event.target.closest('[data-cart-remove]');if(remove){setQuantity(remove.dataset.cartRemove,0);if(dialog.open)document.querySelector('#cart-title').focus();}
    if(event.target.closest('[data-cart-clear]'))clearCart();
    if(event.target.closest('#cart-content a[href="/#collection"]'))dialog.close();
  });
  dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const b=dialog.getBoundingClientRect();if(event.clientX<b.left||event.clientX>b.right||event.clientY<b.top||event.clientY>b.bottom)dialog.close();});
  dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
  document.addEventListener('ketli:cart',render);
  window.addEventListener('storage',event=>{if(event.key!==cartKey&&event.key!==null)return;try{rows=validateCart(JSON.parse(event.newValue||'[]'));}catch{rows=[];}document.dispatchEvent(new CustomEvent('ketli:cart'));});
  render();
}
