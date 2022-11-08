/**
 * @file EzyVet.js
 * @authoe 胡邵杰 
 * @dec https://www.mellaserver.com/api/mellaserver/EzyVet 下的所有接口都在这个<br />
 *      封装,封装函数名称和接口地址保持一致
 * @createDate 20220824
 * 
 */
import { get, postJson, del, patch } from '../ezyvetApi'
const baseURL = 'https://api2.vetspire.com';
// const baseURL = '/v1';




export const graphql = (params, token) => {
    return postJson(`${baseURL}/graphql`, params, { Authorization: token })
}




