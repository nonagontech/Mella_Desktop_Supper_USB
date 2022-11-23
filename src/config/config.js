/**
 * @file config.js
 * @author 胡邵杰
 * @date 2018/10/31
 * @update 2018/10/31
 * @desc 配置文件
 */

//mellaserver的基本地址

export const mellaserverBaseUrl = process.env.REACT_APP_MELLASERVER_BASE_URL

//biggie的基本地址
export const biggieBaseUrl = process.env.REACT_APP_BIGGIE_BASE_URL

//melladesk的基本地址
export const melladeskBaseUrl = process.env.REACT_APP_MELLADESK_BASE_URL

//#ezyvet的基本地址
export const ezyvetBaseUrl = process.env.REACT_APP_EZYVET_BASE_URL

//rhapsody的基本地址
export const rhapsodyBaseUrl = process.env.REACT_APP_RHAPSODY_BASE_URL

//环境变量类型‘react’    'electron'
// export const devType = 'react'

export const devType = 'electron'

console.log('-5512333-', mellaserverBaseUrl);
