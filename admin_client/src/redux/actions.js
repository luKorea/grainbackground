/**
 * 包含多个action模块
 */
import {SET_HEADER_TITLE, GET_USER, RESET_USER} from './action-types';
import {reqLogin} from './../api';
import {message} from 'antd';
import storageUtils from "../utils/storageUtils";

// 设置头部标题
export const setHeaderTitle = (headerTitle) => ({
   type: SET_HEADER_TITLE,
   data: headerTitle
});
const getUser = (user) => ({
   type: GET_USER,
   user
});

// login TODO
export const login = (username, password) => {
   return async dispatch => {
      // 1. 发送一部ajax请求
      const result = await reqLogin(username, password);
      if (result.status === 0) {
         // 2. 分发成功的action
         const user = result.data;
         // 将数据保存到本地中
         storageUtils.saveUser(user);
         dispatch(getUser(user));
      } else {
         // 3. 分发失败的action
         const msg = result.msg;
         message.error(msg);
      }
   }
};

export const logout = () => {
   storageUtils.removeUser();
   return {type: RESET_USER}
};
