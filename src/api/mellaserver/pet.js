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
 * @param {string} dockerId 用户的id值
 * @returns 返回一个接口
 */
export const getPetExamByDoctorId = (dockerId) => {
    return get(`${baseURL}/getPetExamByDoctorId/${dockerId}`, '')
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
 * 根据patientid来添加宠物
 * @param {string} patientid patientid
 * @param {json} params 
 * @returns 
 */
export const addDeskPet = (patientid, params) => {
    return postJson(`${baseURL}/addDeskPet/${patientid}`, params)
}


/**
 * @dec 将历史记录分配给指定宠物
 * @param {string} examId   历史记录id
 * @param {*} params 
 * @returns 
 */
export const addAndSavePetExam = (examId, params) => {
    return postJson(`${baseURL}/addAndSavePetExam/${examId}`, params)
}

/**
 * @dec 删除宠物
 * @param {string} examId  病历单id
 * @param {*} params 
 * @returns 
 */
export const deletePetExamByExamId = (examId, params = '') => {
    return del(`${baseURL}/deletePetExamByExamId/${examId}`, params)
}


/**
 * @dec  根据宠物id来获取宠物的历史记录
 * @param {string} petId 
 * @returns 
 */
export const getPetExamByPetId = (petId) => {
    return get(`${baseURL}/getPetExamByPetId/${petId}`, '')
}


/**
 * @dec 添加历史记录
 * @param {json} params 
 * @returns 
 */
export const addClamantPetExam = (params) => {
    return postJson(`${baseURL}/addClamantPetExam`, params)
}

/**
 * @dec   修改病历单的备注
 * @param {string} examId 病历单id
 * @param {*} params 
 * @returns 
 */
export const updatePetExam = (examId, params) => {
    return postJson(`${baseURL}/updatePetExam/${examId}`, params)
}



/**
 * @dec 更新宠物信息
 * @param {*} petId 
 * @param {*} params 
 * @returns 
 */
export const updatePetInfo = (petId, params) => {
    return postJson(`${baseURL}/updatePetInfo/${petId}`, params)
}

/**
 *  @dec 更新宠物信息
 * @param {*} userId 
 * @param {*} petId 
 * @param {*} params 
 * @returns 
 */
export const updatePetInfo1 = (userId, petId, params) => {
    return postJson(`${baseURL}/updatePetInfo/${userId}/${petId}`, params)
}



/**
 * @dec 获取宠物历史记录(临床+正常测量)
 * @param {*} petId 
 * @returns 
 */
export const getPetExamAndClinicalByPetId = (petId,) => {
    return get(`${baseURL}/getPetExamAndClinicalByPetId/${petId}`, '')
}




/**
 * @dec 通过patientid和petid获取宠物
 * @param {*} params 
 * @returns 
 */
export const getPetInfoByPatientIdAndPetId = (params,) => {
    return postJson(`${baseURL}/getPetInfoByPatientIdAndPetId`, params)
}


/**
 * @dec 根据宠物名称搜索宠物
 * @param {*} params 
 * @returns 
 */
export const listPetsLike = (params,) => {
    return postJson(`${baseURL}/listPetsLike`, params)
}

















