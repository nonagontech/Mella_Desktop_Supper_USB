/**
 * @file EzyVet.js
 * @authoe 胡邵杰 
 * @dec https://www.mellaserver.com/api/mellaserver/EzyVet 下的所有接口都在这个<br />
 *      封装,封装函数名称和接口地址保持一致
 * @createDate 20220824
 * 
 */
import { get, postJson, del, patch } from '../ezyvetApi'
import { biggieBaseUrl } from '../../config/config'
const baseURL = `${biggieBaseUrl}/EzyVet`




export const ezyvetGetPetLatestExam = (params) => {
    return get(`${baseURL}/ezyvetGetPetLatestExam`, params)
}


export const ezyvetUpdateWeight = (paramId, params) => {
    return patch(`${baseURL}/ezyvetUpdateWeight/${paramId}`, params)
}




