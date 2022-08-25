/**
 * @file user.js
 * @authoe 胡邵杰
 * @dec https://www.mellaserver.com/api/mellaserver/user下的所有接口都在这个<br />
 *      封装,封装函数名称和接口地址保持一致
 * @createDate 20220824
 * 
 */


import { get, postJson } from '../api'
import { mellaserverBaseUrl } from '../../config/config'
const baseURL = `${mellaserverBaseUrl}/user`


/**
 * @dec 账号密码登录接口
 * @param {json} params 
 * @returns 
 */
export const mellaLogin = (params) => {
    return postJson(`${baseURL}/mellaLogin`, params)
}


/**
 * @dec 根据组织\工作场所\用户id来获取宠物列表
 * @param {json} params 
 * @returns 
 */
export const listAllPetInfo = (params) => {
    return get(`${baseURL}/listAllPetInfo`, params)
}


/**
 * @dec 获取用户信息
 * @param {*} params 
 * @returns 
 */
export const getUserInfoByUserId = (params) => {
    return get(`${baseURL}/getUserInfoByUserId/${params}`)
}


/**
 * @dec 更新用户信息
 * @param {*} params 
 * @returns 
 */
export const updateUserInfo = (params) => {
    return postJson(`${baseURL}/updateUserInfo`, params)
}





/**
 * 更新用户信息
 * @param {json} params 
 * @returns 
 */
export const update = (params) => {
    return postJson(`${baseURL}/update`, params)
}


/**
 * @dec 判断邮箱是否存在数据库中
 * @param {str} email 
 * @returns 
 */
export const checkUser = (email) => {
    return get(`${baseURL}/checkUser/${email}`, '')
}


/**
 * @dec 根据邮箱发送忘记密码邮件
 * @param {str} email 
 * @returns 
 */
export const forgetPwd = (email) => {
    return get(`${baseURL}/forgetPwd/${email}`, '')
}


/**
 * @dec 重置密码
 * @param {str} email 邮箱
 * @param {*} hash 密码
 * @returns 
 */
export const resetPWD = (email, hash) => {
    return get(`${baseURL}/resetPWD/${email}/${hash}`, '')
}


/**
 * @dec  验证是否点击了邮箱里的修改密码连接
 * @param {str} email 
 * @returns 
 */
export const checkForgetPassword = (email) => {
    return get(`${baseURL}/checkForgetPassword/${email}`, '')
}


/**
 * @dec 发送取消账号限制的邮件
 * @param {str} email 
 * @returns 
 */
export const sendActivateEmail = (email) => {
    return get(`${baseURL}/sendActivateEmail/${email}`, '')
}


/**
 * @dec 注册邮箱验证
 * @param {str} code 验证码
 * @returns 
 */
export const activateUserByEmailCode = (code) => {
    return get(`${baseURL}/activateUserByEmailCode/${code}`, '')
}



/**
 * @dec 注册输入信息后调用此接口获取验证码
 * @param {*} params 
 * @returns 
 */
export const registByAWSSES = (params) => {
    return postJson(`${baseURL}/registByAWSSES`, params)
}














