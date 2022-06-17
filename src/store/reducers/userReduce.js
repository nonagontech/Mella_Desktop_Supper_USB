import {
    MENU_NUM
} from '../actionTypes'

const initialState = {
    //定义菜单选项
    menuNum: "1",

}
export default function userReducer(state = initialState, action) {

    switch (action.type) {
        case MENU_NUM:
            return { ...state, menuNum: action.data }
        default:
            return state;
    }
}
