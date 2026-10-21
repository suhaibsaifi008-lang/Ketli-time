import './ketli.css';
import { mountChrome } from './ketli-common.js';
import { getCart,cartLines } from './ketli-cart.js';

mountChrome();
const root=document.querySelector('#checkout-page');
function render(){
  const rows=getCart();
  const notice=`<section class="checkout-summary" aria-labelledby="restock-title"><p class="overline">A fresh batch is on its way</p><h2 id="restock-title">Your next cup is worth the wait.</h2><p>Be the first to know when your favourite blends are back on the shelf.</p><p class="checkout-notice">Restock notification sign-ups are coming soon.</p><a class="button button-olive" href="/#collection">Explore the teas <span aria-hidden="true">↗</span></a><a href="/store-information.html">About Ketli Time and your privacy</a></section>`;
  root.innerHTML=`<div class="checkout-heading"><p class="overline">Good things take a little time</p><h1>We’re restocking soon.</h1><p>Our little kettles will be back. We’re preparing the next batch of your favourite teas—stay close for restock updates.</p></div>${rows.length?`<div class="checkout-layout"><section aria-labelledby="basket-title"><h2 id="basket-title">Your chosen teas</h2>${cartLines()}<p class="small muted">Your selections stay in your bag while you explore.</p><a class="underlined" href="/#collection">Keep exploring</a></section>${notice}</div>`:notice}`;
}

document.addEventListener('ketli:cart',render);
render();
