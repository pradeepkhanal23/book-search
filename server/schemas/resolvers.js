const { User, Book } = require("../models");
const { signToken, AuthenticationError } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate("savedBooks");
      }
      throw AuthenticationError;
    },
  },
  Mutation: {
    //adding user
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },

    //user login
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw AuthenticationError;
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw AuthenticationError;
      }

      const token = signToken(user);
      return { token, user };
    },

    //saving the book
    saveBook: async (parent, { input }, context) => {
      if (context.user) {
        try {
          const updatedUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $addToSet: { savedBooks: input } },
            { new: true, runValidators: true }
          ).populate("savedBooks");
          return updatedUser;
        } catch (err) {
          console.log(err);
          throw new GraphQLError("Error saving book", {
            extensions: {
              code: "INTERNAL_SERVER_ERROR",
            },
          });
        }
      }
      throw AuthenticationError;
    },
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        try {
          const updatedUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $pull: { savedBooks: { bookId } } },
            { new: true }
          ).populate("savedBooks");
          return updatedUser;
        } catch (err) {
          console.log(err);
          throw new GraphQLError("Error removing book", {
            extensions: {
              code: "INTERNAL_SERVER_ERROR",
            },
          });
        }
      }
      throw AuthenticationError;
    },
  },
};

module.exports = resolvers;
