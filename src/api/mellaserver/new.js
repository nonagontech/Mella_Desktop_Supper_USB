/**
 * @file new.js
 * @authoe 胡邵杰 
 * @dec https://www.mellaserver.com/api/mellaserver/pet 下的所有接口都在这个<br />
 *      封装,封装函数名称和接口地址保持一致
 * @createDate 20220824
 * 
 */
import { get, postJson, del, patch } from '../api'
import { mellaserverBaseUrl } from '../../config/config'
const baseURL = `${mellaserverBaseUrl}/new`


/**
 * @dec 添加预约宠物
 * @param {*} params 
 * @returns 
 */
export const petall_subscribe = (params) => {
    return postJson(`${baseURL}/petall/subscribe`, params)
}

/**
 * @dec 管理员添加医生
 * @param {string} userId 管理员id
 * @param {*} params 
 * @returns 
 */
export const admin_users = (userId, params) => {
    return patch(`${baseURL}/admin/users/${userId}`, params)
}


/**
 * @dec 获取预约宠物
 * @param {*} params 
 * @returns 
 */
export const pet_subscribe_page = (params) => {
    return postJson(`${baseURL}/pet/subscribe/page`, params)
}


