const path = require('path')
const { override, addWebpackAlias } = require('customize-cra')
const { addBabelPlugin } = require('customize-cra')

module.exports = override(
  addWebpackAlias({
    '@': path.resolve(__dirname, 'src'),
  }),
  addBabelPlugin(['babel-plugin-react-compiler', {}])
)
