import {
    SYSTEMTYPE,
    ACTIVEINDEX
} from './../actionTypes'
//定义一个函数，让他返回一个action函数
const getAction = (data, type) => {
    return {
        type,
        data
    }
}

//改变系统的类型
export const setSystemTypeFun = (data) => getAction(data, SYSTEMTYPE)

//改变菜单高亮
export const setMenuActive = (data) => getAction(data, ACTIVEINDEX)
