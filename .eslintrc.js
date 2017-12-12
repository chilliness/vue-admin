// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    // 允许自由缩进
    'indent': 0,
    // JS语句必须以分号结束
    'semi': ['error', 'always'],
    // 允许使用宽松运算符
    'eqeqeq': 0,
    // 允许三目运算中使用布尔值
    'no-unneeded-ternary': 0,
    // 允许使用表达式
    'no-unused-expressions': 0,
    // 函数定义时，function关键字后面不加空格
    'space-before-function-paren': 0
  }
}
