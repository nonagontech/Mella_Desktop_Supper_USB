/**
 * @file organization.js
 * @authoe 胡邵杰 
 * @dec https://www.mellaserver.com/api/mellaserver/organization 下的所有接口都在这个<br />
 *      封装,封装函数名称和接口地址保持一致
 * @createDate 20220824
 * 
 */
import { get, postJson, del } from '../api'
import { mellaserverBaseUrl } from '../../config/config'
const baseURL = `${mellaserverBaseUrl}/organization`



/**
 * @dec  管理员获取组织下的所有医生
 * @param {string} lastOrganization 组织id
 * @param {*} params 
 * @returns 
 */

export const listDoctorsByAdmin = (lastOrganization, params) => {
    return get(`${baseURL}/listDoctorsByAdmin${lastOrganization}`, params)
}

/**
 * @dec 获取所有组织
 * @returns 
 * 
 */
export const listAll = () => {
    return get(`${baseURL}/listAll`, '')
}



/**
 * @dec 创建一个组织
 * @param {str} userId 用户id
 * @param {*} params 
 * @returns 
 */
export const addOrganization = (userId, params) => {
    return postJson(`${baseURL}/listAll/${userId}`, params)
}
