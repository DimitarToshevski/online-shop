const backdrop = document.querySelector('.backdrop');
const sideDrawer = document.querySelector('.mobile-nav');
const menuToggle = document.querySelector('#side-menu-toggle');
const graphQlMongoSubmit = document.querySelector('#mongo-submit-query');
const graphQlMySqlSubmit = document.querySelector('#mysql-submit-query');

function backdropClickHandler() {
  backdrop.style.display = 'none';
  sideDrawer.classList.remove('open');
}

function menuToggleClickHandler() {
  backdrop.style.display = 'block';
  sideDrawer.classList.add('open');
}

function fetchGraphQLProducts(isMongo) {
  return () => {
    fetch('http://localhost:3000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: document.getElementById('query').value,
        isMongo,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        const body = isMongo
          ? response.data.getMongoProducts
          : response.data.getMySqlProducts;

        const url = isMongo
          ? 'http://localhost:3000/mongo/graphql/products'
          : 'http://localhost:3000/graphql/products';

        return fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });
      })
      .then(() => {
        location.href = location.href + '/products';
      });
  };
}

backdrop.addEventListener('click', backdropClickHandler);
menuToggle.addEventListener('click', menuToggleClickHandler);

if (graphQlMongoSubmit) {
  graphQlMongoSubmit.addEventListener('click', fetchGraphQLProducts(true));
}

if (graphQlMySqlSubmit) {
  graphQlMySqlSubmit.addEventListener('click', fetchGraphQLProducts(false));
}
