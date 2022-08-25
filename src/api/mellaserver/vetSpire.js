/**
 * @file vetSpire.js
 * @authoe 胡邵杰 
 * @dec https://www.mellaserver.com/api/mellaserver/VetSpire 下的所有接口都在这个<br />
 *      封装,封装函数名称和接口地址保持一致
 * @createDate 20220824
 * 
 */
import { get, postJson, del } from '../api'
import { mellaserverBaseUrl } from '../../config/config'
const baseURL = `${mellaserverBaseUrl}/VetSpire`



/**
 * @dec 根据vetspire中的api验证
 * @param params 
 */

export const selectLocationsByOrganization = (params) => {
    return postJson(`${baseURL}/selectLocationsByOrganization`, params)
}
