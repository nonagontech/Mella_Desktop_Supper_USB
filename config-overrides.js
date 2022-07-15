const {override, fixBabelImports, addLessLoader} = require('customize-cra');
const rewireCompressionPlugin = require('react-app-rewire-compression-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
 
// 在这里进行自定义修改相关配置
const replaceConfig = () => (config,env) => {
  config.plugins.push(new HardSourceWebpackPlugin())
    // 在这里进行CompressionPlugin的配置
  config = rewireCompressionPlugin(config, env, {
    test: /\.js(\?.*)?$/i,
    cache: true
  })
  // 需要返回config对象
  return config;
};
 
 
module.exports = override(
  // 针对antd实现按需打包: 根据import来打包(使用babel-plugin-import)
  fixBabelImports('inport', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,  // 自动打包相关的样式
  }),
 
  // 使用less-loader对源码中的less的变量进行重新指定,纯实现按需打包不需要
  addLessLoader({
    lessOptions:{
      javascriptEnabled: true,
      modifyVars: {'@primary-color': '#1DA57A'},
    }
 
  }),
  replaceConfig(),
   
)