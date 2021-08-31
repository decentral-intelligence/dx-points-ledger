const { mutation } = require('gotql')
const { XPointsGqlEndpoint } = require('./config')

const createAccount = (accountInput, apikey = '') =>
  mutation(
    XPointsGqlEndpoint,
    {
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
    },
    {
      headers: {
        'x-api-key': apikey,
      },
    },
  )

module.exports = {
  createAccount,
}
