const { mutation } = require('gotql')
const { XPointsGqlEndpoint } = require('./config')

const transferPoints = (transferInput) =>
  mutation(XPointsGqlEndpoint, {
    operation: {
      name: 'transferPoints',
      args: {
        args: '$input',
      },
      fields: [
        {
          sender: {
            fields: ['_id'],
          },
        },
        {
          recipient: {
            fields: ['_id'],
          },
        },
        'amount',
        'tags',
        'signature',
      ],
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
