/**
 * @file VetSpire.js
 * @authoe 胡邵杰 
 * @dec https://www.mellaserver.com/api/mellaserver/VetSpire 下的所有接口都在这个<br />
 *      封装,封装函数名称和接口地址保持一致
 * @createDate 20220824
 * 
 */
import { get, postJson, del, patch } from '../ezyvetApi'
import { melladeskBaseUrl } from '../../config/config'
const baseURL = `${melladeskBaseUrl}/VetSpire`



export const selectExamByPatientId = (parames) => {
    return postJson(`${baseURL}/selectExamByPatientId`, parames)
}


export const updateVitalsTemperatureByVitalId = (parames) => {
    return postJson(`${baseURL}/updateVitalsTemperatureByVitalId`, parames)
}


export const selectLocations = (parames) => {
    return postJson(`${baseURL}/selectLocations`, parames)
}


export const selectProvidersByLocationId = (parames) => {
    return postJson(`${baseURL}/selectProvidersByLocationId`, parames)
}




