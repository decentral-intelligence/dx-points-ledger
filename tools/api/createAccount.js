const { mutation } = require('gotql')
const { XPointsGqlEndpoint } = require('./config')

const createAccount = (accountInput) =>
  mutation(XPointsGqlEndpoint, {
    operation: {
      name: 'createAccount',
      args: {
        args: '$input',
      },
      fields: ['_id', 'alias', 'publicKey'],
    },
    variables: {
      input: {
        type: 'AccountInput!',
        value: accountInput,
      },
    },
  })

module.exports = {
  createAccount,
}
