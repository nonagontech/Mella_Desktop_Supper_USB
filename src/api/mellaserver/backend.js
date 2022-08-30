/**
 * @file backend.js
 * @authoe 胡邵杰 
 * @dec https://www.mellaserver.com/api/mellaserver/backend 下的所有接口都在这个<br />
 *      封装,封装函数名称和接口地址保持一致
 * @createDate 20220824
 * 
 */
import { get, postJson, del } from '../api'
import { mellaserverBaseUrl } from '../../config/config'
const baseURL = `${mellaserverBaseUrl}/backend`


/**
 * @dec 获取硬件的最新版本信息
 * @param {str} hardWareType 硬件类型 <br/>
 * 硬件种类:分成mellahome1,mellahome2,mellapro1(6针机器),mellapro(7针机器)
 * @returns 
 */
export const getOta = (hardWareType) => {
    return get(`${baseURL}/getOta?type=${hardWareType}`)
}