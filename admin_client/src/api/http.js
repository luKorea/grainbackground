/*
*  TODO 封装ajax请求
* */
import axios from 'axios';
import {message} from 'antd';


export default function http(url, data = {}, method = 'GET') {
   return new Promise((resolve, reject) => {
       let res;
       if (method === 'GET') res = axios.get(url, {params: data}, method);
       else res = axios.post(url, data, method);
       res.then(response => {
           resolve(response.data);
       }).catch(err => {
           message.error('请求失败了' + err.message);
       })
   });
}
