document.querySelector('#mode-tema').addEventListener('click', () => {
    const body = document.querySelector('body');
    const nav = document.querySelector('nav');
    const categorias = document.querySelector('.categorias');
    const button = document.querySelector('#mode-tema');
    const names = document.querySelectorAll('.card-name');
    const preco = document.querySelectorAll('.card-preco');
    const botao =  document.querySelectorAll('.button-comprar');
    const desc = document.querySelectorAll('.desc');
    const card = document.querySelectorAll('.card');

    names.forEach(name => {
        name.classList.toggle('dark-mode');
    });
    preco.forEach(preco => {
        preco.classList.toggle('dark-mode');
    });
    botao.forEach(botao => {
        botao.classList.toggle('dark-mode');
    });
    desc.forEach(desc => {
        desc.classList.toggle('dark-mode');
    });
    card.forEach(card => {
        card.classList.toggle('dark-mode');
    });


    body.classList.toggle('dark-mode');
    nav.classList.toggle('dark-mode');
    button.classList.toggle('dark-mode');
    categorias.classList.toggle('dark-mode');


    
    if (body.classList.contains('dark-mode')) {
        button.innerHTML = '<i class="fas fa-moon"></i>';
      } else {
        button.innerHTML = '<i class="fas fa-sun"></i>';
      }
      
  });