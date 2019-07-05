/**
 *  TODO 封装请求接口
 */
import jsonp from 'jsonp';
import http from './http';
import {message} from 'antd';
/**
 * 登录接口 [/login]
 * @param username
 * @param password
 */
export const reqLogin = (username, password) => http('/login', {username, password}, 'POST');
/**
 * 添加用户接口 [/manage/user/add]
 * @param user
 */
export const reqAddUser = (user) => http('/manage/user/add', user, 'POST');
/* TODO json请求的接口请求函数
 */
export const reqWeather = (city) => {

    return new Promise((resolve, reject) => {
        const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`;
        // 发送jsonp请求
        jsonp(url, {}, (err, data) => {
            // 如果成功了
            if (!err && data.status==='success') {
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
