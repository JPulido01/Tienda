// Productos de ejemplo
const products = [
  { id: 1, name: "Camiseta clásica", price: 19.99, desc: "Algodón suave, disponible en varios colores.", img: "https://i.pinimg.com/736x/7f/f9/1c/7ff91c3189cac89afccc60f02fc2f609.jpg" },
  { id: 2, name: "Taza de cerámica", price: 9.5, desc: "Ideal para café y té.", img: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=2" },
  { id: 3, name: "Mochila urbana", price: 49.99, desc: "Espacio para laptop, resistente al agua.", img: "https://i.pinimg.com/736x/eb/26/cf/eb26cf83675fa068929c42352ab75a58.jpg" },
  { id: 4, name: "Libreta de notas", price: 7.25, desc: "Tapa dura, 120 páginas.", img: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=4" },
  { id: 5, name: "Auriculares", price: 34.99, desc: "Sonido nítido y cómodos.", img: "https://i.pinimg.com/736x/fe/1b/98/fe1b98f5aee2a63d90fb61fc6114cbd6.jpg" },
  { id: 6, name: "Llavero metálico", price: 4.0, desc: "Pequeño y resistente.", img: "https://i.pinimg.com/1200x/46/82/ae/4682ae798f5e84c22e73612f4620e0e3.jpg" },
  { id: 7, name: "Portatil", price: 1000.0, desc: "Facil de tranportar y efectivo.", img: "https://i.pinimg.com/1200x/46/82/ae/4682ae798f5e84c22e73612f4620e0e3.jpg" }
];

const state = {
  cart: [] // { id, qty }
};

const $ = (sel) => document.querySelector(sel);

function formatPrice(n){ return `$${n.toFixed(2)}`; }

function renderProducts(filter=""){
  const container = $("#products");
  container.innerHTML = "";
  const q = filter.trim().toLowerCase();
  const list = products.filter(p => !q || p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q));
  list.forEach(p => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}" loading="lazy" />
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <div class="price-row">
        <div class="price">${formatPrice(p.price)}</div>
        <button class="btn btn-primary" data-id="${p.id}">Añadir</button>
      </div>
    `;
    container.appendChild(card);
  });
  // attach add listeners
  container.querySelectorAll("button[data-id]").forEach(btn=>{
    btn.addEventListener("click", ()=> addToCart(Number(btn.dataset.id)));
  });
  if(list.length === 0){
    container.innerHTML = `<p style="color:var(--muted)">No se encontraron productos.</p>`;
  }
}

function addToCart(id){
  const item = state.cart.find(i => i.id === id);
  if(item) item.qty++;
  else state.cart.push({ id, qty: 1 });
  saveAndRenderCart();
}

function saveAndRenderCart(){
  // opcional: persistir en localStorage
  try{ localStorage.setItem("simple_shop_cart", JSON.stringify(state.cart)); }catch(e){}
  updateCartCount();
  renderCartItems();
}

function loadCart(){
  try{
    const raw = localStorage.getItem("simple_shop_cart");
    if(raw) state.cart = JSON.parse(raw);
  }catch(e){}
}

function updateCartCount(){
  const count = state.cart.reduce((s, i) => s + i.qty, 0);
  $("#cart-count").textContent = count;
}

function renderCartItems(){
  const container = $("#cart-items");
  container.innerHTML = "";
  if(state.cart.length === 0){
    container.innerHTML = `<p style="color:var(--muted)">Tu carrito está vacío.</p>`;
    $("#cart-total").textContent = formatPrice(0);
    return;
  }
  let total = 0;
  state.cart.forEach(ci => {
    const p = products.find(x=>x.id===ci.id);
    const lineTotal = p.price * ci.qty;
    total += lineTotal;
    const el = document.createElement("div");
    el.className = "cart-item";
    el.innerHTML = `
      <img src="${p.img}" alt="${p.name}" />
      <div class="meta">
        <h4>${p.name}</h4>
        <p>${formatPrice(p.price)} · Subtotal ${formatPrice(lineTotal)}</p>
      </div>
      <div class="controls">
        <input type="number" min="1" value="${ci.qty}" data-id="${ci.id}" />
        <button class="btn btn-outline remove" data-id="${ci.id}">Eliminar</button>
      </div>
    `;
    container.appendChild(el);
  });
  $("#cart-total").textContent = formatPrice(total);

  // Attach events
  container.querySelectorAll('input[type="number"]').forEach(input=>{
    input.addEventListener("change", (e)=>{
      const id = Number(e.target.dataset.id);
      let val = Number(e.target.value) || 1;
      if(val < 1) val = 1;
      updateQty(id, val);
    });
  });
  container.querySelectorAll(".remove").forEach(btn=>{
    btn.addEventListener("click", ()=> removeFromCart(Number(btn.dataset.id)));
  });
}

function updateQty(id, qty){
  const item = state.cart.find(i=>i.id===id);
  if(!item) return;
  item.qty = qty;
  saveAndRenderCart();
}

function removeFromCart(id){
  state.cart = state.cart.filter(i=>i.id !== id);
  saveAndRenderCart();
}

function clearCart(){
  state.cart = [];
  saveAndRenderCart();
}

function checkout(){
  if(state.cart.length === 0){
    alert("El carrito está vacío.");
    return;
  }
  // Simulación de compra
  const total = state.cart.reduce((s,i)=>{
    const p = products.find(x=>x.id===i.id);
    return s + p.price * i.qty;
  },0);
  alert(`Gracias por tu compra. Total: ${formatPrice(total)} (simulado)`);
  clearCart();
  closeCart();
}

/* Modal controls */
function openCart(){
  const modal = $("#cart-modal");
  modal.classList.add("show");
  modal.setAttribute("aria-hidden","false");
  renderCartItems();
}
function closeCart(){
  const modal = $("#cart-modal");
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden","true");
}

/* Init */
document.addEventListener("DOMContentLoaded", ()=>{
  $("#year").textContent = new Date().getFullYear();
  loadCart();
  renderProducts();
  updateCartCount();

  $("#search").addEventListener("input", (e)=>{
    renderProducts(e.target.value);
  });
  $("#cart-button").addEventListener("click", openCart);
  $("#close-cart").addEventListener("click", closeCart);
  $("#checkout").addEventListener("click", checkout);
  $("#clear-cart").addEventListener("click", ()=>{
    if(confirm("¿Vaciar el carrito?")) clearCart();
  });

  // close modal by clicking outside content
  $("#cart-modal").addEventListener("click", (e)=>{
    if(e.target === e.currentTarget) closeCart();
  });
});