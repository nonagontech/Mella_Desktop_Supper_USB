/**
 * @file pet.js
 * @authoe 胡邵杰 
 * @dec https://www.mellaserver.com/api/mellaserver/workplace 下的所有接口都在这个<br />
 *      封装,封装函数名称和接口地址保持一致
 * @createDate 20220824
 * 
 */
import { get, postJson, del } from '../api'
import { mellaserverBaseUrl } from '../../config/config'
const baseURL = `${mellaserverBaseUrl}/workplace`


/**
 * 
 * @dec 根据组织id获取工作场所
 * @param {string} organizationId 
 * @returns 
 */
export const listAllWorkplaceByOrganizationId = (organizationId) => {
    return get(`${baseURL}/listAllWorkplaceByOrganizationId${organizationId}`, '')
}


/**
 * @dec 添加工作场所
 * @param {str} userId 用户id
 * @param {*} params 
 * @returns 
 */

export const addWorkplace = (userId, params) => {
    return postJson(`${baseURL}/addWorkplace${userId}`, params)
}
