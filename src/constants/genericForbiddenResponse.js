module.exports = {
  403: {
    description: "You do not have privileges to acces this endpoint",
    type: "object",
    properties: {
      msg: {
        type: "string",
        default: "You do not have access to this endpoint",
      },
    },
  },
};
