const { mutation } = require('gotql')
const { XPointsGqlEndpoint } = require('./config')

const airdropPoints = (airdropInput) =>
  mutation(XPointsGqlEndpoint, {
    operation: {
      name: 'airdropPoints',
      args: {
        args: '$input',
      },
      fields: ['_id'],
    },
    variables: {
      input: {
        type: 'TransferInput!',
        value: airdropInput,
      },
    },
  })

module.exports = {
  airdropPoints,
}
