import React, {Component} from 'react';
import {Card, Button, Table, Modal, message} from 'antd';
import {PAGE_SIZE} from "../../utils/constants";
import {formateDate} from './../../utils/dateUtils';
import AddRoles from './AddRoles';
import TreeRole from './TreeRole';
import {reqRole, reqAddRole, reqRoleAuth} from './../../api';
import {connect} from 'react-redux';
import {logout} from "../../redux/actions";

/**
 * 角色路由
 */

class Role extends Component {

    constructor(props) {
        super(props);
        this.state = {
            roles: [],
            role: {},
            isShowAdd: false,
            isShowAuth: false
        };
        this.auth = React.createRef();
    }
    initColumns = () => {
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name'
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                // TODO 函数只传递一个参数，简写
                render: formateDate
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                render: formateDate
            },
            {
                title: '授权人',
                dataIndex: 'auth_name'
            }
        ];
    };
    onRow = (role) => {
        return {
            onClick: event => {
               this.setState({role})
            }, // 点击行
        };
    };

    // TODO 获取角色列表
    getRoleList = async () => {
      const result = await reqRole();
      if (result.status === 0) {
          const roles = result.data;
          this.setState({roles});
      }
    };
    // 添加角色
    addRoles = () => {
        this.form.validateFields(async (err, data) => {
            if (!err) {
                const {roleName} = data;
                const result = await reqAddRole(roleName);
                if (result.status === 0) {
                    message.success('添加角色成功');
                    const role = result.data;
                    // 更新roles的状态
                    /*const roles = [...this.state.roles];
                    roles.push(role);
                    this.setState({roles});*/
                    // TODO 方案优化， 基于原本数组的数据进行更新
                    this.setState(state => ({
                        roles: [...state.roles, role]
                    }));
                    this.setState({isShowAdd: false})
                }  else {
                    message.error('角色创建失败');
                }
            }
        });
    };
    // TODO 权限管理
    authRole = async () => {
        const role = this.state.role;
        const menus = this.auth.current.getMenus();
        role.menus = menus;
        // 授权人
        role.auth_name = this.props.user.username;
        const result = await reqRoleAuth(role);
        if (result.status === 0) {
            this.setState({isShowAuth: false});
            // TODO 如果当前更新的是自己角色的权限，强制退出登录
            if (role._id === this.props.user.role_id) {
                message.info('您已修改了权限，请重新登录');
                this.props.logout();
            } else {
                message.success('授权成功');
                this.getRoleList();
            }
        } else message.error('授权失败');
    };

    componentWillMount(): void {
        this.initColumns();
    }

    componentDidMount(): void {
        this.getRoleList();
    }

    render() {

        const {roles, role, isShowAdd, isShowAuth} = this.state;

        const title = (
            <span>
                <Button
                    type='primary'
                    style={{marginRight: 10}}
                    onClick={() => this.setState({isShowAdd: true})}
                >
                    创建角色
                </Button>
                <Button
                    type='primary'
                    disabled={!role._id}
                    onClick={() => this.setState({isShowAuth: true})}
                >
                    设置角色权限
                </Button>
            </span>
        );

        return (
           <Card title={title}>
               <Table
                   dataSource={roles}
                   columns={this.columns}
                   onRow={this.onRow}
                   bordered
                   pagination={{
                       defaultPageSize: PAGE_SIZE,
                       showQuickJumper: true
                   }}
                   rowKey='_id'
                   rowSelection={{
                       type: 'Radio',
                       selectedRowKeys: [role._id],
                       onSelect: (role) => {
                           this.setState({role})
                       }
                   }}
               />
               {
                   isShowAdd &&
                   <Modal
                       title="添加角色"
                       visible={isShowAdd}
                       onOk={this.addRoles}
                       onCancel={() => this.setState({isShowAdd: false})}
                       okText="确认"
                       cancelText="取消"
                   >
                       <AddRoles
                           setForm={(form) => this.form = form}
                       />
                   </Modal>
               }
               {
                   isShowAuth &&
                   <Modal
                       title="权限管理"
                       visible={isShowAuth}
                       onOk={this.authRole}
                       onCancel={() => this.setState({isShowAuth: false})}
                       okText="确认"
                       cancelText="取消"
                   >
                       <TreeRole
                           role={role}
                           ref={this.auth}
                       />
                   </Modal>
               }
           </Card>
        )
    }
}

export default connect(
    state => ({user: state.user}),
    {logout}
)(Role);
