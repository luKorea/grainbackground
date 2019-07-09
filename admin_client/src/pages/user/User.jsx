import React, {Component} from 'react';
import {Card, Table, Modal, Button, message} from 'antd';
import {PAGE_SIZE} from "../../utils/constants";
import {formateDate} from './../../utils/dateUtils';
import {reqUserList, reqDeleteUser, reqAddOrUpdateUser} from './../../api';
import LinkButton from './../../components/link-button';
import UserForm from './UserForm';

/**
 * 用户路由
 */

class User extends Component {

    constructor(props) {
        super(props);
        this.state = {
            users: [], // 用户列表
            roles: [], // 角色列表
            isShow: false
        }
    }

    initColumns = () => {
        this.columns = [
            {
                title: '用户名',
                dataIndex: 'username'
            },
            {
                title: '邮箱',
                dataIndex: 'email'
            },

            {
                title: '电话',
                dataIndex: 'phone'
            },
            {
                title: '注册时间',
                dataIndex: 'create_time',
                render: formateDate
            },
            {
                title: '所属角色',
                dataIndex: 'role_id',
                render: (role_id) => this.roleNames[role_id]
            },
            {
                title: '操作',
                render: (user) => (
                    <span>
            <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
            <LinkButton onClick={() => this.deleteUser(user)}>删除</LinkButton>
          </span>
                )
            },
        ];
    };
    initRoleNames = (roles) => {
        const roleNames = roles.reduce((pre, role) => {
            pre[role._id] = role.name;
            return pre
        }, {});
        // 保存
        this.roleNames = roleNames
    };


    getUserList = async () => {
      const result = await reqUserList();
      if (result.status === 0) {
          const {users, roles} = result.data;
          this.initRoleNames(roles);
          this.setState({ users, roles });
      }
    };

    // TODO 添加或更新用户信息
    addOrUpdateUser = () => {
        this.form.validateFields(async (err, value) => {
            if (!err) {
                this.setState({isShow: false});
                const user = this.form.getFieldsValue();
                if (this.user && this.user._id) {
                    user._id = this.user._id;
                }
                const result = await reqAddOrUpdateUser(user);
                if (result.status === 0) {
                    message.success(`${this.user ? '更新' : '添加'}用户成功`);
                    this.getUserList();
                }
            }

        })
    };

    //  显示用户详情信息
    showUpdate = (user) => {
        this.user = user;
        this.setState({isShow: true})
    };

    showAdd = () => {
        this.user = null;
        this.setState({isShow: true})
    };

    // TODO  删除用户
    deleteUser = (user) => {
        Modal.confirm({
            title: `您确定${user.username}删除吗`,
            okText: "确认",
            cancelText: "取消",
            onOk: async () => {
                const result = await reqDeleteUser(user._id);
                if (result.status === 0) {
                    message.success(`删除${user.username}成功`);
                    this.getUserList();
                }
            }
        });
    };

    componentWillMount(): void {
        this.initColumns();
    }
    componentDidMount(): void {
        this.getUserList();
    }

    render() {

        const {users, roles, isShow} = this.state;
        const user = this.user || {};
        const title = (<Button type='primary' onClick={this.showAdd}>创建用户</Button>);

        return (
            <Card title={title}>
                <Table
                    bordered
                    rowKey='_id'
                    dataSource={users}
                    columns={this.columns}
                    pagination={{defaultPageSize: PAGE_SIZE, showQuickJumper:true}}
                />
                {
                    isShow &&
                    <Modal
                        title={user._id ? '修改用户' : '添加用户'}
                        visible={isShow}
                        onOk={this.addOrUpdateUser}
                        okText='确认'
                        cancelText='取消'
                        onCancel={() => {
                            this.setState({isShow: false})
                        }}
                    >
                        <UserForm
                            setForm={form => this.form = form}
                            roles={roles}
                            user={user}
                        />
                    </Modal>
                }

            </Card>
        )
    }
}

export default User;
