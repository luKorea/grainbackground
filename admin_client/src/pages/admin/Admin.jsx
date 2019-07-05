import React, {Component} from 'react';
import {Redirect, Switch, Route} from 'react-router-dom';
import {message, Layout} from 'antd';
import MemoryUtils from './../../utils/memoryUtils';
import LeftNav from './../../components/left-nav/LeftNav';
import TopNav from './../../components/top-nav/TopNav';
import Home from '../home/Home';
import Category from '../category/Category';
import Product from '../product/Product';
import Role from '../role/Role';
import User from '../user/User';
import Bar from '../charts/Bar';
import Line from '../charts/Line';
import Pie from '../charts/Pie';

import './admin.less';

const { Footer, Sider, Content } = Layout;

/**
 *  后台路由
 */

class Admin extends Component {
    render() {
        const user = MemoryUtils.user;
        // 未登录
        if (!user || !user._id) {
            message.warning('你还未登录，请先登录');
            return <Redirect to='/login' />
        }
        return (
                <Layout style={{height: '100%'}}>
                    <Sider className='admin-sider'><LeftNav /></Sider>
                    <Layout>
                        <TopNav />
                        <Content className='admin-main'>
                            <Switch>
                                <Route path='/home' component={Home} />
                                <Route path='/category' component={Category} />
                                <Route path='/product' component={Product} />
                                <Route path='/role' component={Role} />
                                <Route path='/user' component={User} />
                                <Route path='/charts/bar' component={Bar} />
                                <Route path='/charts/line' component={Line} />
                                <Route path='/charts/pie' component={Pie} />
                                <Redirect to='/home' />
                            </Switch>
                        </Content>
                        <Footer className='admin-footer'>后台网站开发，个人开发娱乐</Footer>
                    </Layout>
                </Layout>
        )
    }
}

export default Admin;
