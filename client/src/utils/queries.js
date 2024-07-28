import { gql } from "@apollo/client";

// query to get the user by username
export const GET_USER = gql`
  query getUser($username: String!) {
    user(username: $username) {
      _id
      username
      email
      savedBooks {
        bookId
        title
        authors
        description
      }
    }
  }
`;

// Query to get the logged-in user's info
export const GET_ME = gql`
  query getMe {
    me {
      _id
      username
      email
      savedBooks {
        bookId
        title
        authors
        description
      }
    }
  }
`;

// Query to search for books using Google Books API
export const SEARCH_BOOKS = gql`
  query searchBooks($query: String!) {
    searchBooks(query: $query) {
      bookId
      authors
      title
      description
      image
    }
  }
`;
