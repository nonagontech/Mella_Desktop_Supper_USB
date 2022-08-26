/**
 * @file EzyVet.js
 * @authoe 胡邵杰 
 * @dec https://www.mellaserver.com/api/mellaserver/EzyVet 下的所有接口都在这个<br />
 *      封装,封装函数名称和接口地址保持一致
 * @createDate 20220824
 * 
 */
import { get, postJson, del, patch } from '../ezyvetApi'
import { melladeskBaseUrl } from '../../config/config'
const baseURL = `${melladeskBaseUrl}/EzyVet`


/**
 * @dec 重新获取令牌
 * @param {*} parames 
 * @returns 
 */
export const ezyvetauth = (parames) => {
    return get(`${baseURL}/ezyvetauth`, parames)
}


export const checkAndSaveAnimalList = (parames) => {
    return postJson(`${baseURL}/checkAndSaveAnimalList`, parames)
}

export const healthstatus = (paramId, petVitalId, parames) => {
    return patch(`${baseURL}/healthstatus/${paramId}/${petVitalId}`, parames)
}






