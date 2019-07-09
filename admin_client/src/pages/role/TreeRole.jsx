import React, {PureComponent} from 'react';
import {Tree, Input, Form} from 'antd';
import PropTypes from 'prop-types';
import menuList from './../../config/menuConfig';

const {Item} = Form;
const {TreeNode} = Tree;

class TreeRole extends PureComponent {
    static propTypes = {
        role: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        const {menus} = this.props.role;
        this.state = {
            checkedKeys: menus
        };

    }

    onCheck = (checkedKeys) => {
        this.setState({checkedKeys});
    };

    // 获取Tree
    getTreeNode = (menuList) => {
        return menuList.map(item => (
            <TreeNode title={item.title} key={item.key}>
                {item.children ? this.getTreeNode(item.children) : null}
            </TreeNode>
        ));
    };

    getMenus = () => this.state.checkedKeys;

    componentWillMount(): void {
        this.treeNode = this.getTreeNode(menuList);
    }

    render() {
        const {role} = this.props;
        const {checkedKeys} = this.state;
        return (
           <div>
                   <Item label='角色名称' labelCol={{span: 4}} wrapperCol={{span: 20}}>
                       <Input value={role.name} disabled/>
                   </Item>
               <Tree
                   defaultExpandAll
                   checkable
                   checkedKeys={checkedKeys}
                   onCheck={this.onCheck}
               >
                   <TreeNode title="平台权限" key="0-0">
                       {this.treeNode}
                   </TreeNode>
               </Tree>
           </div>
        )
    }
}

export default TreeRole;
