/**
 *  TODO 封装请求接口
 */
import jsonp from 'jsonp';
import http from './http';
import {message} from 'antd';

const BASE = '';
/**
 * TODO 登录接口
 * @param username
 * @param password
 */
export const reqLogin = (username, password) => http(BASE + '/login', {username, password}, 'POST');
/**
 * TODO 添加用户接口
 * @param user
 */
export const reqAddUser = (user) => http(BASE + '/manage/user/add', user, 'POST');
/**
 * TODO 获取一级/二级分类的数据
 * @param parentId
 */
export const reqCategory = (parentId) => http(BASE + '/manage/category/list', {parentId});
/**
 * TODO 添加分类
 * @param parentId
 * @param categoryName
 */
export const reqAddCategory = (parentId, categoryName) => http(BASE + '/manage/category/add', {
    categoryName,
    parentId
}, 'POST');
/**
 * 更新分类
 * @param categoryId
 * @param categoryName
 */
export const reqUpdateCategory = (categoryId, categoryName) => http(BASE + '/manage/category/update', {
    categoryId,
    categoryName
}, 'POST');


/**
 *  TODO json请求的接口请求函数
 *  @param city
 */
export const reqWeather = (city) => {

    return new Promise((resolve, reject) => {
        const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`;
        // 发送jsonp请求
        jsonp(url, {}, (err, data) => {
            // 如果成功了
            if (!err && data.status === 'success') {
                // 取出需要的数据
                const {dayPictureUrl, weather} = data.results[0].weather_data[0];
                resolve({dayPictureUrl, weather})
            } else {
                // 如果失败了
                message.error('获取天气信息失败!')
            }

        })
    })
};
