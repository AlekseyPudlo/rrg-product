require('ts-node').register({
    transpileOnly: true,
    compilerOptions: {
      module: 'commonjs',
    },
  });
  
  const config = require('./knexfile.ts').default;
  
  module.exports = config;