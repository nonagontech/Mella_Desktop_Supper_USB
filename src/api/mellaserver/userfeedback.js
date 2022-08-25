/**
 * @file userfeedback.js
 * @authoe 胡邵杰 
 * @dec https://www.mellaserver.com/api/mellaserver/userfeedback 下的所有接口都在这个<br />
 *      封装,封装函数名称和接口地址保持一致
 * @createDate 20220824
 * 
 */
import { get, postJson, del } from '../api'
import { mellaserverBaseUrl } from '../../config/config'
const baseURL = `${mellaserverBaseUrl}/userfeedback`


/**
 * @dec bug提交
 * @param {*} params 
 * @returns 
 */
export const savefeedback = (params) => {
    return postJson(`${baseURL}/savefeedback`, params)
}
