const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type MongoProduct {
        _id: ID!
        title: String!
        description: String!
        imageUrl: String!
        price: Float!
        userId: ID!
    }

    type MySqlProduct {
        id: ID!
        title: String!
        description: String!
        imageUrl: String!
        price: Float!
        userId: ID!
    }

    type RootQuery {
        getMongoProducts: [MongoProduct!]
        getMySqlProducts: [MySqlProduct!]
    }

    schema {
        query: RootQuery
    }
`);
