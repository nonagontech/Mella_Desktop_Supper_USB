import request from './http.js'
const deskURL = 'https://www.mellaserver.com/api/melladesk'
const mellaURL = 'https://www.mellaserver.com/api/mellaserver'

//登录接口
export const addLogin = (data) => request({ url: `${mellaURL}/user/mellaLogin`, method: "post", data, })

//获取登录二维码接口

export const addQRCode = (data = '') => request({ url: `${deskURL}/user/getLoginQRcode`, method: "get", data, })
