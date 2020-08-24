const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type Product {
        _id: ID!
        title: String!
        description: String!
        imageUrl: String!
        price: Float!
        userId: ID!
    }

    type RootQuery {
        getProducts: [Product]
    }

    schema {
        query: RootQuery
    }
`);
