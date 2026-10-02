// CONFIGURACIÓN: cambiá el número por el tuyo, en formato internacional, sin +, espacios ni guiones.
const WHATSAPP_NUMBER = '59891833717';
// Editá estos ejemplos con tus productos reales. Las imágenes pueden ser URLs públicas de fotos tuyas.
const products = [
  {id:1,name:'Remera Black',price:650,description:'Remera de estilo urbano.',variants:'Talles: XL',image:''},

  
];
const cart = new Map();
const money = n => new Intl.NumberFormat('es-UY',{style:'currency',currency:'UYU',maximumFractionDigits:0}).format(n);
const productsEl=document.querySelector('#products');
function renderProducts(){
  productsEl.innerHTML=products.map(p=>`<article class="product"><div class="product-media">${p.image?`<img src="${escapeAttr(p.image)}" alt="${escapeAttr(p.name)}" loading="lazy">`:`<div class="placeholder">BLACK ROSE</div>`}</div><div class="product-details"><div class="product-line"><h3>${escapeHtml(p.name)}</h3><span class="price">${money(p.price)}</span></div><p class="desc">${escapeHtml(p.description||'')}</p><p class="variants">${escapeHtml(p.variants||'')}</p><button class="button light" data-add="${p.id}">Agregar al carrito</button></div></article>`).join('');
  productsEl.querySelectorAll('[data-add]').forEach(b=>b.addEventListener('click',()=>{const id=Number(b.dataset.add);cart.set(id,(cart.get(id)||0)+1);renderCart();b.textContent='Agregado ✓';setTimeout(()=>b.textContent='Agregar al carrito',900)}));
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function escapeAttr(s){return escapeHtml(s)}
function total(){return [...cart.entries()].reduce((sum,[id,q])=>sum+products.find(p=>p.id===id).price*q,0)}
function renderCart(){
  const items=document.querySelector('#cart-items');
  document.querySelector('#cart-count').textContent=[...cart.values()].reduce((a,b)=>a+b,0);
  document.querySelector('#cart-total').textContent=money(total());
  if(!cart.size){items.innerHTML='<p class="empty">Tu carrito está vacío. Agregá algún producto para empezar.</p>';return}
  items.innerHTML=[...cart.entries()].map(([id,q])=>{const p=products.find(x=>x.id===id);return `<div class="cart-row"><div>${p.image?`<img src="${escapeAttr(p.image)}" alt="">`:'<div class="cart-thumb"></div>'}</div><div><h3>${escapeHtml(p.name)}</h3><p>${money(p.price)} c/u</p><div class="quantity"><button data-minus="${id}" aria-label="Restar">−</button><span>${q}</span><button data-plus="${id}" aria-label="Sumar">+</button></div><button class="remove" data-remove="${id}">Eliminar</button></div><strong>${money(p.price*q)}</strong></div>`}).join('');
  items.querySelectorAll('[data-minus]').forEach(b=>b.onclick=()=>{const id=+b.dataset.minus;const q=(cart.get(id)||0)-1;if(q<=0)cart.delete(id);else cart.set(id,q);renderCart()});
  items.querySelectorAll('[data-plus]').forEach(b=>b.onclick=()=>{const id=+b.dataset.plus;cart.set(id,(cart.get(id)||0)+1);renderCart()});
  items.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{cart.delete(+b.dataset.remove);renderCart()});
}
const backdrop=document.querySelector('#cart-backdrop');
document.querySelector('#open-cart').onclick=()=>{backdrop.classList.remove('hidden');document.body.style.overflow='hidden'};
function closeCart(){backdrop.classList.add('hidden');document.body.style.overflow=''}
document.querySelector('#close-cart').onclick=closeCart;
backdrop.addEventListener('click',e=>{if(e.target===backdrop)closeCart()});
document.querySelector('#checkout').onclick=()=>{
  if(!cart.size){alert('Tu carrito está vacío. Agregá algún producto primero.');return}
  const lines=[...cart.entries()].map(([id,q])=>{const p=products.find(x=>x.id===id);return `• ${p.name} x${q} — ${money(p.price*q)}${p.variants?`\n  ${p.variants}`:''}`});
  const message=['Hola, quiero realizar este pedido de BLACK ROSE:','',...lines,'',`TOTAL: ${money(total())}`,'','Mis datos:','Nombre:','Forma de entrega:','Dirección (si corresponde):','','Por favor, indicame los datos para realizar la transferencia bancaria y cómo enviar el comprobante.'].join('\n');
  const url=`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url,'_blank','noopener,noreferrer');
};
document.querySelector('#year').textContent=new Date().getFullYear();
renderProducts();renderCart();
