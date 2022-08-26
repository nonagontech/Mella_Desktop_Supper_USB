/**
 * @file user.js
 * @authoe 胡邵杰 
 * @dec https://www.mellaserver.com/api/mellaserver/user 下的所有接口都在这个<br />
 *      封装,封装函数名称和接口地址保持一致
 * @createDate 20220824
 * 
 */
import { get, postJson, del, patch } from '../ezyvetApi'
import { melladeskBaseUrl } from '../../config/config'
const baseURL = `${melladeskBaseUrl}/user`


/**
 * @dec 邀请别人加入组织
 * @param {*} userId 用户id
 * @param {*} organizationId 组织id
 * @param {*} parames 
 * @returns 
 */
export const inviteUserByEmail = (userId, organizationId, parames) => {
    return postJson(`${baseURL}/inviteUserByEmail/${userId}/${organizationId}`, parames)
}

export const updateUserInfo = (parames) => {
    return postJson(`${baseURL}/updateUserInfo`, parames)
}




export const loginWithQRcode = (QRToken) => {
    return get(`${baseURL}/loginWithQRcode/${QRToken}`, '')
}


export const getLoginQRcode = () => {
    return get(`${baseURL}/getLoginQRcode`, '')
}



export const resendDeskRegistEmail = (logupEmailCode, params) => {
    return get(`${baseURL}/resendDeskRegistEmail/${logupEmailCode}`, params)
}


export const deskRegistAWSSNS = (params) => {
    return postJson(`${baseURL}/deskRegistAWSSNS`, params)
}






