/**
 * 用来根据老的state和指定的action生成并返回对应的函数
 */

import {combineReducers} from 'redux';
import storageUtils from "../utils/storageUtils";
import {SET_HEADER_TITLE, GET_USER, RESET_USER} from './action-types';


// 管理title
const initTitle = '首页';
const headerTitle = (state = initTitle, action) => {
    switch (action.type) {
        case SET_HEADER_TITLE:
            return action.data;
        default:
            return state;
    }
};

// 管理用户信息
const initUser = storageUtils.getUser();
const user = (state = initUser, action) => {
    switch (action.type) {
        case GET_USER:
            return action.user;
        case RESET_USER:
            return {};
        default:
            return state;
    }
};

export default combineReducers({
    headerTitle,
    user
});
