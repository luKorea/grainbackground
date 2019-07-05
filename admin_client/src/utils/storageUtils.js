/**
 * TODO 进行Local数据存储的工具管理模块
 */
import store from 'store';

const USER_KEY = 'user_key';

export default {
    // 保存用户
    saveUser(user) {
        // localStorage.setItem(USER_KEY, JSON.stringify(user));
        store.set(USER_KEY, user);
    },
    //  获取用户信息
    getUser() {
        // 容错处理
        // return JSON.parse(localStorage.getItem(USER_KEY) || '{}');
        return store.get(USER_KEY) || {};
    },
    //  删除用户信息
    removeUser() {
        // localStorage.removeItem(USER_KEY);
        store.remove(USER_KEY);
    }
}
