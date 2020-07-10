const isAccountId = (str) => /XPOINTZ-(\w{4}-){3}\w{5}/.test(str)

module.exports = {
  isAccountId,
}
