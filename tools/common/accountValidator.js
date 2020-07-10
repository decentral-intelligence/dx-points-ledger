const { isAccountId } = require('./isAccountId')

const accountValidator = (address) => (isAccountId(address) ? true : 'Not a valid account')

module.exports = {
  accountValidator,
}
