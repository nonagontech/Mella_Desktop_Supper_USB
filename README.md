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
  
## 开发配置
在 .env.development 和 .env.production 里面添加请求服务地址,在/src/config中引用
  
## 开发规则

### 文件命名规则
参考
 ```
http://file.nonagon:8090/pages/viewpage.action?pageId=64389386
```

### 文件注释规则
参考 
```
http://file.nonagon:8090/pages/viewpage.action?pageId=64389372
```

## 开始
- 安装依赖
```bash
$ yarn 
```
- 重新编译
    
```bash
//每次重新下载依赖后需要执行这个命令，这个指令的作用是针对当前版本的electron进行重建本机的node.js模块
$ yarn rebuild
```
- 启动react服务
```bash
$ yarn start
```
- 启动Electron服务
  ```bash
  // Mac
  $ yarn mac
  // Windows
  yarn win
  ```

## 代码提交
- 如果是需要代码打包，则要修改.git/config中的url为git@github.com:nonagontech/Mella_Desktop_Supper_USB.git
- 如果代码提交拉取，则要修改.git/config中的url为git@192.168.0.15:hushaojie/Mella_Desktop_Super_USB.git


## 打包
- 将package.json中的version进行加一
- 将src/utils/appversion.js中的version进行加一（要和package.json中的版本号一致），再将updateTime的日期改成当天的时间，
- 将dist1文件夹中的内容全部删除
- react进行打包
  ```
  yarn build
  ```
- electron进行打包发布
  ``` 
  yarn release
  ```
- 打包完成后进入到disk1中找到安装包（Windows选择以.exe结尾的文件，Mac选择以.dmg结尾的文件）进行安装测试
- 当Windows和Mac都打包发布完成后才能执行下一步
- 测试没有问题后参考 http://file.nonagon:8090/pages/viewpage.action?pageId=72614996 文档将最新版本发布出去
