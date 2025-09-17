const socket = io();

const productsList = document.getElementById('productsList');
const productForm = document.getElementById('productForm');

function renderProducts(products) {
  productsList.innerHTML = '';
  products.forEach(p => {
    const li = document.createElement('li');
    li.dataset.id = p.id;
    li.innerHTML = `<strong>${p.title}</strong> - $${p.price} 
      <button class="deleteBtn" data-id="${p.id}">Eliminar</button>`;
    productsList.appendChild(li);
  });

  document.querySelectorAll('.deleteBtn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.target.dataset.id;
      socket.emit('deleteProduct', id);
    });
  });
}

socket.on('updateProducts', (products) => {
  renderProducts(products);
});

socket.on('errorFromServer', (err) => {
  console.error('Server error:', err);
  alert(err.msg || 'Error del servidor');
});

productForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(productForm);
  const product = {
    title: formData.get('title'),
    price: Number(formData.get('price')),
    code: formData.get('code'),
    stock: Number(formData.get('stock')),
    category: formData.get('category') || 'general',
    thumbnails: []
  };
  socket.emit('newProduct', product);
  productForm.reset();
});
