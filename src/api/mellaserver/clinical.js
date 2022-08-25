/**
 * @file clinical.js
 * @authoe 胡邵杰 
 * @dec https://www.mellaserver.com/api/mellaserver/clinical 下的所有接口都在这个<br />
 *      封装,封装函数名称和接口地址保持一致
 * @createDate 20220824
 * 
 */
import { get, postJson, del } from '../api'
import { mellaserverBaseUrl } from '../../config/config'
const baseURL = `${mellaserverBaseUrl}/clinical`


/**
 * @dec 体重保存
 * @param {*} params 
 * @returns 
 */
export const addAllClinical = (params) => {
    return postJson(`${baseURL}/addAllClinical`, params)
}

/**
 * @dec 1.2版本的猫预测
 * @param {*} params 
 * @returns 
 */
export const catv12Predict = (params) => {
    return postJson(`${baseURL}/catv12Predict`, params)
}