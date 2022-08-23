# React框架

## 要求
依赖下载全部使用yarn

## 准备工作
- 使用node V14.17.0版本
- 状态管理使用Redux,详情参考 https://www.redux.org.cn/
- 接口调用使用axios,详情参考 
  ```
   https://www.axios-http.cn/docs/req_config

- 服务统一在src/api管理，请参考样例

## 开始
- 安装依赖
```bash
$ yarn i
```
- 启动服务
```bash
$ yarn start
```

- 开发生产环境配置
  在 .env.development 和 .env.production 里面添加请求服务地址,在/src/config中引用


## 文件命名规则
参考
 ```
http://file.nonagon:8090/pages/viewpage.action?pageId=64389386
```

## 文件注释规则
参考 
```
http://file.nonagon:8090/pages/viewpage.action?pageId=64389372
```

## 打包
```
yarn build
```
