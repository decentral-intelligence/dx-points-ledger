const { query } = require('gotql')
const { XPointsGqlEndpoint } = require('./config')

const fetchAccount = (accountId) =>
  query(XPointsGqlEndpoint, {
    operation: {
      name: 'account',
      args: {
        id: accountId,
      },
      fields: ['_id', 'role', 'alias', 'balance'],
    },
  })

module.exports = {
  fetchAccount,
}
