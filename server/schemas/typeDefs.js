const typeDefs = `
    type User {
    _id:ID
    username:String
    email: String
    savedBooks: [Book]
    bookCount: Int
    }

    type Book {
    bookId: String
    authors: [String]
    description: String
    title: String
    image: String
    link: String
    }

    input BookInput {
    bookId: String!
    authors: [String]
    description: String
    title: String!
    image: String
    link: String
    }


    type Query{
    user(username: String!): User
    books: [Book]
    book(bookId: String!): Book
    me: User
    }

    type Auth {
    token: ID!
    user: User
    }

    type Mutation{
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(input: BookInput!): User
    removeBook(bookId: String!): User
    }
`;

module.exports = typeDefs;
