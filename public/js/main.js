const backdrop = document.querySelector('.backdrop');
const sideDrawer = document.querySelector('.mobile-nav');
const menuToggle = document.querySelector('#side-menu-toggle');
const graphQlSubmit = document.querySelector('#submit-query');

function backdropClickHandler() {
  backdrop.style.display = 'none';
  sideDrawer.classList.remove('open');
}

function menuToggleClickHandler() {
  backdrop.style.display = 'block';
  sideDrawer.classList.add('open');
}

function fetchGraphQLProducts() {
  fetch('http://localhost:3000/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: document.getElementById('query').value }),
  })
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      return fetch('http://localhost:3000/mongo/graphql/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(response.data.getProducts),
      });
    })
    .then(() => {
      location.href = location.href + '/products';
    });
}

backdrop.addEventListener('click', backdropClickHandler);
menuToggle.addEventListener('click', menuToggleClickHandler);
graphQlSubmit.addEventListener('click', fetchGraphQLProducts);
