/**
 * @file petall.js
 * @authoe 胡邵杰
 * @dec https://www.mellaserver.com/api/mellaserver/preOrder 下的所有接口都在这个<br />
 *      封装,封装函数名称和接口地址保持一致
 * @createDate 20221121
 *
 */
import { get, postJson, postFormData, postFormData2, del, put } from '../api'
import { mellaserverBaseUrl } from '../../config/config'
const baseURL = `${mellaserverBaseUrl}/preOrder`



/**
 * @dec 根据组织获取所有宠物
 * @param {str} lastOrganization 组织id
 * @param {*} params
 * @returns
 */

//用户获取订阅信息
export const getOrderInfo = (userId) => {
    return get(`${baseURL}/getOrderInfo/${userId}`, '')
}
//生成订单
export const buy = (userId, params) => {
    return postJson(`${baseURL}/${userId}`, params)
}
//对订单进行付款
export const payForOrder = (preOrderId, params) => {
    return postFormData2(`${baseURL}/payForOrder/${preOrderId}`, params)
}
// 更新

/**
 * 根据订单号获取订单是否支付、过期等
 * @param {string} preOrderId
 * @returns
 */
export const getPreOrderById = (preOrderId,) => {
    return get(`${baseURL}/getPreOrderById/${preOrderId}`, '')
}




