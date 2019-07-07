import React, {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import {Menu, Icon} from 'antd';
import menuList from '../../config/menuConfig'
import './leftnav.less'

const SubMenu = Menu.SubMenu;

/*
左侧导航的组件
 */
class LeftNav extends Component {

    /*
    根据menu的数据数组生成对应的标签数组
    使用map() + 递归调用
    */
    getMenuNodes= (menuList) => {
        // 得到当前请求的路由路径
        const path = this.props.location.pathname;

        return menuList.map(item => {
            if(!item.children) {
                return (
                    <Menu.Item key={item.key}>
                        <Link to={item.key}>
                            <Icon type={item.icon}/>
                            <span>{item.title}</span>
                        </Link>
                    </Menu.Item>
                )
            } else {
                // 查找一个与当前请求路径匹配的子Item
                const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0);
                // 如果存在, 说明当前item的子列表需要打开
                if (cItem) {
                    this.openKey = item.key
                }

                return (
                    <SubMenu
                        key={item.key}
                        title={
                            <span>
              <Icon type={item.icon}/>
              <span>{item.title}</span>
            </span>
                        }
                    >
                        {this.getMenuNodes(item.children)}
                    </SubMenu>
                )
            }

        })
    };

    /*
    在第一次render()之前执行一次
    为第一个render()准备数据(必须同步的)
     */
    componentWillMount () {
        this.menuNodes = this.getMenuNodes(menuList)
    }

    render() {
        // debugger
        // 得到当前请求的路由路径
        let path = this.props.location.pathname;
        if (path.indexOf('/product') === 0) {  // TODO 解决点击商品子路由时，侧边栏选中失败
            path = '/product';
        }
        // 得到需要打开菜单项的key
        const openKey = this.openKey;

        return (
            <div className="left-container">
                <Link to='/'>
                    <div className='left-logo' />
                </Link>

                <Menu
                    mode="inline"
                    theme="dark"
                    selectedKeys={[path]}
                    defaultOpenKeys={[openKey]}
                >

                    {
                        this.menuNodes
                    }

                </Menu>
            </div>
        )
    }
}

/*
withRouter高阶组件:
包装非路由组件, 返回一个新的组件
新的组件向非路由组件传递3个属性: history/location/match
 */
export default withRouter(LeftNav)
