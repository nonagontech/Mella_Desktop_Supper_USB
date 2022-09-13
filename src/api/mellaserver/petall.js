/**
 * @file petall.js
 * @authoe 胡邵杰
 * @dec https://www.mellaserver.com/api/mellaserver/petall 下的所有接口都在这个<br />
 *      封装,封装函数名称和接口地址保持一致
 * @createDate 20220824
 *
 */
import { get, postJson, del } from '../api'
import { mellaserverBaseUrl } from '../../config/config'
const baseURL = `${mellaserverBaseUrl}/petall`



/**
 * @dec 根据组织获取所有宠物
 * @param {str} lastOrganization 组织id
 * @param {*} params
 * @returns
 */
export const pet_petall = (lastOrganization, params) => {
  return postJson(`${baseURL}/pet/${lastOrganization}/petall`, params)
}
/**
 * @dec 根据用户id查询当前组织下的所有宠物
 * @param {*} params
 * @returns
 */
export const getPersonPetByUserId = (params) => {
  return get(`${baseURL}/getPersonPetByUserId?userId=${params.userId}&orgId=${params.orgId}`);
}


