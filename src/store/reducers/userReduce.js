import {
    MENU_NUM,
    TEST
} from '../actionTypes'

const initialState = {
    //定义菜单选项
    menuNum: "1",
    test:null,

}
export default function userReducer(state = initialState, action) {

    switch (action.type) {
        case MENU_NUM:
            return { ...state, menuNum: action.data }
            case TEST:
                return { ...state, test: action.data }
        default:
            return state;
    }
}
