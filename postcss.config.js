module.exports = {
    plugins: {
        autoprefixer: {
            overrideBrowserslist: [
              'Android >= 4.0',
              'iOS >= 8',
              'Chrome > 40',
              'ff > 30',
              'ie >= 8'
            ]
        },
        'postcss-pxtorem': {
          rootValue: 37.5,
          propList: ['*']
        }
      }
  }
