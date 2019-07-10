/**
 * 登录路由
 */
import React, {Component} from 'react';
import {Form, Input, Icon, Button} from 'antd';
import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import {login} from './../../redux/actions';
import './login.less';

class Login extends Component {

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                const {username, password} = values;
                this.props.login(username, password);
            } else console.log(err);
        });
    };

    render() {

        // 判断用户是否登录
        const user = this.props.user;
        if (user && user._id) return <Redirect to='/home' />;

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

const wrapperLogin = Form.create({name: 'login'})(Login);
export default connect(
    state => ({user: state.user}),
    {login}
)(wrapperLogin);
