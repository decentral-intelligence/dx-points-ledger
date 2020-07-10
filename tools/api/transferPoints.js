const { mutation } = require('gotql')
const { XPointsGqlEndpoint } = require('./config')

const transferPoints = (transferInput) =>
  mutation(XPointsGqlEndpoint, {
    operation: {
      name: 'transferPoints',
      args: {
        args: '$input',
      },
      fields: ['_id'],
    },
    variables: {
      input: {
        type: 'TransferInput!',
        value: transferInput,
      },
    },
  })

module.exports = {
  transferPoints,
}
