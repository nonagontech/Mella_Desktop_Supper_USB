/**
 * @file product.js
 * @authoe 胡邵杰
 * @dec https://www.mellaserver.com/api/mellaserver/product 下的所有接口都在这个<br />
 *      封装,封装函数名称和接口地址保持一致
 * @createDate 20221121
 *
 */
import { get, postJson, del } from '../api'
import { mellaserverBaseUrl } from '../../config/config'
const baseURL = `${mellaserverBaseUrl}/product`



/**
 * @dec 根据组织获取所有宠物
 * @param {str} lastOrganization 组织id
 * @param {*} params
 * @returns
 */
export const list = () => {
    return get(`${baseURL}/list`, '')
}