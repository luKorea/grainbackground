import React, {PureComponent} from 'react';
import {Form, Input, Select} from 'antd';
import PropTypes from 'prop-types';

const {Item} = Form;
const {Option} = Select;

class UserForm extends PureComponent {

    static propTypes = {
      setForm: PropTypes.func.isRequired,
      roles: PropTypes.array.isRequired,
      user: PropTypes.object
    };

    componentWillMount(): void {
        this.props.setForm(this.props.form);
    }

    // TODO 验证手机号码
    phoneValidate = (rule, value, callback) => {
        let phone = /^1((3[\d])|(4[5,6,9])|(5[0-3,5-9])|(6[5-7])|(7[0-8])|(8[1-3,5-8])|(9[1,8,9]))\d{8}$/;
        if (phone.test(value)) callback();
        else callback('请输入正确的手机号码');
    };
    // TODO 验证邮箱
    emailValidate = (rule, value, callback) => {
        let email = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        if (email.test(value)) callback();
        else callback('请输入正确的邮箱格式');
    };


    render() {

        const {getFieldDecorator} = this.props.form;
        const {roles} = this.props;
        const user = this.props.user || {};
        // 设置表单布局
        const formItemLayout = {
            labelCol: {span: 4},
            wrapperCol: {span: 20},
        };


        return (
            <Form {...formItemLayout}>
                <Item label='用户名'>
                    {
                        getFieldDecorator('username',{
                            initialValue: user.username,
                            rules: [
                                {required: true, whiteSpace: true, message: '请输入用户名'},
                                {min: 4, message: '用户名至少为4位'},
                                {max: 12, message: '用户名最多12位'},
                                {pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是字母，数字下划线组成'}
                            ],
                        })(
                            <Input placeholder='请输入用户名'/>
                        )
                    }
                </Item>
                {
                    user._id ? null : (
                        <Item label='密码'>
                            {
                                getFieldDecorator('password',{
                                    initialValue: user.password,
                                    rules: [
                                        {required: true, whiteSpace: true, message: '请输入密码'},
                                        {min: 5, message: '密码至少为五位'},
                                        {max: 12, message: '密码最多12位'}
                                    ],
                                })(
                                    <Input type='password' placeholder='请输入密码'/>
                                )
                            }
                        </Item>
                    )
                }
                <Item label='手机号码'>
                    {
                        getFieldDecorator('phone',{
                            initialValue: user.phone,
                            rules:[
                                {required: true, message: '手机号码必须填写'},
                                {validator: this.phoneValidate}
                            ]
                        })(
                            <Input placeholder='请输入手机号码'/>
                        )
                    }
                </Item>
                <Item label='邮箱'>
                    {
                        getFieldDecorator('email',{
                            initialValue: user.email,
                            rules: [
                                {required: true, message: '邮箱必须填写'},
                                {validator: this.emailValidate}
                            ]
                        })(
                            <Input placeholder='请输入邮箱'/>
                        )
                    }
                </Item>
                <Item label='角色'>
                    {
                        getFieldDecorator('role_id',{
                            initialValue: user.role_id,
                            rules: [
                                {required: true, message: '角色请选者'},
                            ]
                        })(
                            <Select>
                                {
                                    roles.map(item => (
                                        <Option value={item._id} key={item._id}>{item.name}</Option>
                                    ))
                                }
                            </Select>
                        )
                    }
                </Item>
            </Form>
        )
    }
}

export default Form.create()(UserForm);
