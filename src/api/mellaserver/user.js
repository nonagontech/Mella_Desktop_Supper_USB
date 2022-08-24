/**
 * @file user.js
 * @authoe 胡邵杰
 * @dec https://www.mellaserver.com/api/mellaserver/user下的所有接口都在这个<br />
 *      封装,封装函数名称和接口地址保持一致
 * @createDate 20220824
 * 
 */


import { get, postJson } from '../api'
import { mellaserverBaseUrl } from '../../config/config'
const baseURL = `${mellaserverBaseUrl}/user`


/**
 * @dec 账号密码登录接口
 * @param {json} params 
 * @returns 
 */
export const mellaLogin = (params) => {
    return postJson(`${baseURL}/mellaLogin`, params)
}


/**
 * @dec 根据组织\工作场所\用户id来获取宠物列表
 * @param {json} params 
 * @returns 
 */
export const listAllPetInfo = (params) => {
    return get(`${baseURL}/listAllPetInfo`, params)
}






