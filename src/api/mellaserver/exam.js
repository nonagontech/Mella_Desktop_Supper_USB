/**
 * @file exam.js
 * @authoe 胡邵杰
 * @dec https://www.mellaserver.com/api/mellaserver/pet 下的所有接口都在这个<br />
 *      封装,封装函数名称和接口地址保持一致
 * @createDate 20220824
 *
 */
import { get, postJson, del } from '../api'
import { mellaserverBaseUrl } from '../../config/config'
const baseURL = `${mellaserverBaseUrl}/exam`


/**
 * @dec 体重保存
 * @param {*} params
 * @returns
 */
export const addClamantPetExam = (params) => {
    return postJson(`${baseURL}/addClamantPetExam`, params)
}

/**
 * @dec 根据历史记录id获取全部的过程数据
 * @param {str} examId 历史记录id
 * @returns
 */
export const getClinicalDataByExamId = (examId) => {
    return get(`${baseURL}/getClinicalDataByExamId/${examId}`, "")
}
/**
 * @dec 获取宠物上一次测量体重，体长，温度的结果和时间
 * @param {*} petId
 * @returns
 */
export const getRecentPetData = (petId) => {
  return get(`${baseURL}/getRecentPetData/${petId}`,"");
}
