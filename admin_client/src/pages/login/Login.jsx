/**
 * 登录路由
 */
import React, {Component} from 'react';
import {Form, Input, Icon, Button, message} from 'antd';
import {Redirect} from 'react-router-dom';
import {reqLogin} from './../../api';
import MemoryUtils from './../../utils/memoryUtils';
import StorageUtils from './../../utils/storageUtils';
import './login.less';

class Login extends Component {

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                const {username, password} = values;
                const response = await reqLogin(username, password);
                if (response.status === 0) {
                    message.success('登录成功');
                    // 将用户信息存储到内存中
                    const user = response.data;
                    MemoryUtils.user = user; // 存储到内存
                    StorageUtils.saveUser(user);  // 存储到localstorage
                    this.props.history.replace('/');
                } else message.warning(response.msg);
            } else console.log(err);
        });
    };

    render() {

        // 判断用户是否登录
        const user = MemoryUtils.user;
        if (user && user._id) return <Redirect to='/' />;

        const {getFieldDecorator} = this.props.form;
        return (
            <div className="main">
                <header className="header">
                    <h1>后台登录系统</h1>
                </header>
                <div className="container">
                    <section className='login-container'>
                        <h2>用户登录</h2>
                        <Form onSubmit={this.handleSubmit} className="login-form">
                            <Form.Item>
                                {getFieldDecorator('username', {
                                    rules: [
                                        {required: true, whiteSpace: true, message: '请输入用户名'},
                                        {min: 4, message: '用户名至少为4位'},
                                        {max: 12, message: '用户名最多12位'},
                                        {pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是字母，数字下划线组成'}
                                    ],
                                    initialValue: 'admin'
                                })(
                                    <Input
                                        prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                        placeholder="Username"
                                    />,
                                )}
                            </Form.Item>
                            <Form.Item>
                                {getFieldDecorator('password', {
                                    rules: [
                                        {required: true, whiteSpace: true, message: '请输入密码'},
                                        {min: 5, message: '密码至少为五位'},
                                        {max: 12, message: '密码最多12位'}
                                    ],
                                })(
                                    <Input
                                        prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                        type="password"
                                        placeholder="Password"
                                    />,
                                )}
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" className="login-form-button btn">
                                    Log in
                                </Button>
                            </Form.Item>
                        </Form>
                    </section>
                </div>
            </div>
        )
    }
}

export default Form.create({name: 'login'})(Login);
