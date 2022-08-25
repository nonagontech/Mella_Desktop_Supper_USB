/**
 * @file user.js
 * @authoe 胡邵杰 
 * @dec https://www.mellaserver.com/api/mellaserver/user 下的所有接口都在这个<br />
 *      封装,封装函数名称和接口地址保持一致
 * @createDate 20220824
 * 
 */
import { get, postJson, del, patch } from '../ezyvetApi'
import { biggieBaseUrl } from '../../config/config'
const baseURL = `${biggieBaseUrl}/user`


export const changeLatestWorkplace = (userId, workplaceId, roleId = 2) => {
    return get(`${baseURL}/changeLatestWorkplace/${userId}/${roleId}/${workplaceId}`,
        '')
}
