const jwt = require("jsonwebtoken");
const { GraphQLError } = require("graphql");

// set token secret and expiration date
const secret = process.env.JWT_SECRET;
const expiration = "1h";

module.exports = {
  // using graphql error type to throw an error when un unauthenticated user tries to access the restricted resources
  AuthenticationError: new GraphQLError("Could not authenticate user.", {
    extensions: {
      code: "UNAUTHENTICATED",
    },
  }),
  authMiddleware: function ({ req }) {
    // making sure any tokens attached wether in the body, query or request headers respectively
    let token = req.body.token || req.query.token || req.headers.authorization;

    // if its sent via headers, we need to only extract the token leaving the "Bearer" string alone
    if (req.headers.authorization) {
      token = token.split(" ").pop().trim();
    }

    // if there is no token at all, we just send the req as it is without any privilege
    if (!token) {
      return req;
    }

    // if the token is there, we are trying to verify it using the jwt verify method
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });

      // once its verified, we send the user details
      req.user = data;
    } catch {
      console.log("Invalid token");
    }

    return req;
  },
  signToken: function ({ email, username, _id }) {
    // destructuring the data as payload
    const payload = { email, username, _id };

    //trying to create a signature unique to the specific user
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
