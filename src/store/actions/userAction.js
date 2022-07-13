import {
    MENU_NUM,
    TEST
}
    from '../actionTypes'
//定义一个函数，让他返回一个action函数
const getAction = (data, type) => {
    return {
        type,
        data
    }
}

//修改选择的菜单选项
export const setMenuNum = (data) => getAction(data, MENU_NUM)

//测试
export const setTest = (data) => getAction(data, TEST)