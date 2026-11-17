const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  
  // Force dev server to bind to LAN IP
  config.devServer = {
    ...config.devServer,
    host: '192.168.100.53',
    port: 8081,
    allowedHosts: 'all',
    client: { webSocketURL: 'auto://0.0.0.0:0/ws' }
  };
  
  return config;
};
