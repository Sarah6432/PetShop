function addToCart(event) {
  var notificacao = document.getElementById('notificacao');
    notificacao.classList.add('show');

    
    setTimeout(function() {
        notificacao.classList.remove('show');
    }, 3500);

  const card = event.target.closest('.card');
  const productName = card.querySelector('.card-name').textContent;
  const productPrice = card.querySelector('.real').textContent;
  const productImage = card.querySelector('.produto').src;

  const productData = {
    name: productName,
    price: productPrice,
    image: productImage,
    quantity: 1
  };

  const cartProducts = JSON.parse(localStorage.getItem('cartProducts')) || [];
  const existingProduct = cartProducts.find((p) => p.name === productData.name && p.price === productData.price && p.image === productData.image);

  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    cartProducts.push(productData);
  }

  localStorage.setItem('cartProducts', JSON.stringify(cartProducts));


  buscarEndereco();
  window.location.href = 'compras.html';
}

function buscarEndereco() {
  const cep = document.getElementById('cep').value;

  if (!isValidCEP(cep)) {
    alert("Por favor, insira um CEP válido.");
    return;
  }

  const url = `https://viacep.com.br/ws/${cep}/json/`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.erro) {
        document.getElementById('endereco').innerText = "CEP não encontrado.";
      } else {
        const endereco = `CEP: ${data.cep}, ${data.logradouro}, ${data.bairro}, ${data.localidade}, ${data.uf}`;
        document.getElementById('endereco').innerText = endereco;


        let deliveryFee = 0;
        if (data.uf === "SP") {
          deliveryFee = 20.00;
        } else if (data.uf === "RJ") {
          deliveryFee = 15.00;
        } else {
          deliveryFee = 10.00;
        }


        document.getElementById('valor-entrega').textContent = `R$${deliveryFee.toFixed(2).replace('.', ',')}`;
        updateTotalsWithDelivery(deliveryFee);
      }
    })
    .catch(error => console.error('Erro:', error));
}


function isValidCEP(cep) {
  const cepRegex = /^[0-9]{5}-[0-9]{3}$/;
  return cepRegex.test(cep);
}


function updateTotalsWithDelivery(deliveryFee) {
  const cartProducts = JSON.parse(localStorage.getItem('cartProducts')) || [];
  let subtotal = 0;


  cartProducts.forEach(product => {
    subtotal += parseFloat(product.price.replace('R$', '').replace(',', '.')) * product.quantity;
  });

  const total = subtotal + deliveryFee;


  document.getElementById('sub-total-preco').textContent = `R$${subtotal.toFixed(2).replace('.', ',')}`;
  document.getElementById('total-preco').textContent = `R$${total.toFixed(2).replace('.', ',')}`;
}


function loadCart() {
  const cartProducts = JSON.parse(localStorage.getItem('cartProducts'));

  if (cartProducts) {
    const cartList = document.getElementById('cart');
    cartList.innerHTML = '';

    cartProducts.forEach((product) => {
      const listItem = document.createElement('li');
      listItem.classList.add('lista-nova');
      const productInfo = document.createElement('div');
      productInfo.classList.add('div-nova');
      productInfo.className = 'product-info';
      const productImage = document.createElement('img');
      productImage.classList.add('img-nova');
      productImage.src = product.image;
      productImage.alt = 'imagem do produto';
      productInfo.appendChild(productImage);
      const productName = document.createElement('p');
      productName.classList.add('nome-novo');
      productName.textContent = product.name;
      const productPrice = document.createElement('p');
      productPrice.classList.add('preco-novo');
      productPrice.textContent = product.price;
      const buttonGroup = document.createElement('div');
      buttonGroup.classList.add('botao-novo');
      buttonGroup.className = 'button-group';
      const decreaseBtn = document.createElement('button');
      decreaseBtn.textContent = '-';
      decreaseBtn.classList.add('decrease-novo');
      decreaseBtn.addEventListener('click', () => decreaseProductQuantity(product));
      const itemQnt = document.createElement('input');
      itemQnt.classList.add('input-novo');
      itemQnt.type = 'number';
      itemQnt.min = '1';
      itemQnt.max = '100';
      itemQnt.value = product.quantity;
      itemQnt.readOnly = true;
      itemQnt.id = `input-${product.name}-${product.price}`;
      const increaseBtn = document.createElement('button');
      increaseBtn.classList.add('increase-novo');
      increaseBtn.addEventListener('click', () => increaseProductQuantity(product));
      increaseBtn.textContent = '+';

      const removeText = document.createElement('p');
      removeText.className = 'remove-text';
      removeText.textContent = 'Remover';
      removeText.addEventListener('click', () => removeProductFromCart(product));
      buttonGroup.appendChild(decreaseBtn);
      buttonGroup.appendChild(itemQnt);
      buttonGroup.appendChild(increaseBtn);
      buttonGroup.appendChild(removeText);
      listItem.appendChild(productInfo);
      listItem.appendChild(productName);
      listItem.appendChild(productPrice);
      listItem.appendChild(buttonGroup);
      cartList.appendChild(listItem);
    });
  }
}

function updateTotals() {
  const cartProducts = JSON.parse(localStorage.getItem('cartProducts')) || [];
  let subtotal = 0;
  let total = 0;
  const deliveryFee = 0.00;


  cartProducts.forEach(product => {
    subtotal += parseFloat(product.price.replace('R$', '').replace(',', '.')) * product.quantity;
  });

  total = subtotal + deliveryFee;


  document.getElementById('sub-total-preco').textContent = `R$${subtotal.toFixed(2).replace('.', ',')}`;
  document.getElementById('total-preco').textContent = `R$${total.toFixed(2).replace('.', ',')}`;
  document.getElementById('valor-entrega').textContent = `R$${deliveryFee.toFixed(2).replace('.', ',')}`;
}

function removeProductFromCart(product) {
  const cartProducts = JSON.parse(localStorage.getItem('cartProducts'));
  const index = cartProducts.findIndex((p) => p.name === product.name && p.price === product.price && p.image === product.image);
  if (index !== -1) {
    cartProducts.splice(index, 1);
    localStorage.setItem('cartProducts', JSON.stringify(cartProducts));
    loadCart();
  }
  updateTotals();
}

function decreaseProductQuantity(product) {
  const cartProducts = JSON.parse(localStorage.getItem('cartProducts'));
  const index = cartProducts.findIndex((p) => p.name === product.name && p.price === product.price && p.image === product.image);
  if (index !== -1) {
    if (cartProducts[index].quantity > 1) {
      cartProducts[index].quantity--;
      localStorage.setItem('cartProducts', JSON.stringify(cartProducts));
      const input = document.getElementById(`input-${product.name}-${product.price}`);
      input.value = cartProducts[index].quantity;
    } else {
      removeProductFromCart(product);
    }
  }
  updateTotals();
}

function increaseProductQuantity(product) {
  const cartProducts = JSON.parse(localStorage.getItem('cartProducts'));
  const index = cartProducts.findIndex((p) => p.name === product.name && p.price === product.price && p.image === product.image);
  if (index !== -1) {
    cartProducts[index].quantity++;
    localStorage.setItem('cartProducts', JSON.stringify(cartProducts));
    const input = document.getElementById(`input-${product.name}-${product.price}`);
    input.value = cartProducts[index].quantity;
  }
  updateTotals();
}


window.onload = function () {
  loadCart();
  updateTotals();
};
