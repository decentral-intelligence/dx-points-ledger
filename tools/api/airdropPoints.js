const { mutation } = require('gotql')
const { XPointsGqlEndpoint } = require('./config')

const airdropPoints = (airdropInput, apikey = '') =>
  mutation(
    XPointsGqlEndpoint,
    {
      operation: {
        name: 'airdropPoints',
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
          value: airdropInput,
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
  airdropPoints,
}
