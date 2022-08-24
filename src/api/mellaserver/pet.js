/**
 * @file pet.js
 * @authoe 胡邵杰 
 * @dec https://www.mellaserver.com/api/mellaserver/pet 下的所有接口都在这个<br />
 *      封装,封装函数名称和接口地址保持一致
 * @createDate 20220824
 * 
 */
import { get, postJson, del } from '../api'
import { mellaserverBaseUrl } from '../../config/config'
const baseURL = `${mellaserverBaseUrl}/pet`
/**
 * @dec  获取医生用户测量的所有病历单
 * @param {string} params 用户的id值
 * @returns 返回一个接口
 */
export const getPetExamByDoctorId = (params) => {
    return get(`${baseURL}/getPetExamByDoctorId/${params}`, '')
}

/**
 * @dec 通过宠物物种类型获取此类型下的所有品种
 * @param {json} params { speciesId: 1 } 物种id
 */
export const selectBreedBySpeciesId = (params) => {
    return postJson(`${baseURL}/selectBreedBySpeciesId`, params)
}


/**
 * @dec  判断patientId是否被占用
 * @param {string} params 用户的id值
 * @returns 返回一个接口
 */
export const checkPatientId = (params) => {
    return get(`${baseURL}/checkPatientId`, params)
}


/**
 * 
 * @param {string} url patientid
 * @param {json} params 
 * @returns 
 */
export const addDeskPet = (url, params) => {
    return postJson(`${baseURL}/addDeskPet/${url}`, params)
}


/**
 * @dec 将历史记录分配给指定宠物
 * @param {string} url   历史记录id
 * @param {*} params 
 * @returns 
 */
export const addAndSavePetExam = (url, params) => {
    return postJson(`${baseURL}/addAndSavePetExam/${url}`, params)
}

export const deletePetExamByExamId = (url, params) => {
    return del(`${baseURL}/deletePetExamByExamId/${url}`, params)
}











