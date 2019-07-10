import React, {Component} from 'react';
import {Redirect, Switch, Route} from 'react-router-dom';
import {connect} from 'react-redux';
import {Layout} from 'antd';
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
import Error from '../error/Error';

import './admin.less';

const { Footer, Sider, Content } = Layout;

/**
 *  后台路由
 */

class Admin extends Component {
    render() {
        const user = this.props.user;
        // 未登录
        if (!user || !user._id) {
            return <Redirect to='/login' />
        }
        return (
                <Layout style={{minHeight: '100%'}}>
                    <Sider className='admin-sider'><LeftNav /></Sider>
                    <Layout>
                        <TopNav />
                        <Content className='admin-main'>
                            <Switch>
                                <Redirect exact from='/' to='/home' />
                                <Route path='/home' component={Home} />
                                <Route path='/category' component={Category} />
                                <Route path='/product' component={Product} />
                                <Route path='/role' component={Role} />
                                <Route path='/user' component={User} />
                                <Route path='/charts/bar' component={Bar} />
                                <Route path='/charts/line' component={Line} />
                                <Route path='/charts/pie' component={Pie} />
                                <Route  component={Error} />
                            </Switch>
                        </Content>
                        <Footer className='admin-footer'>后台网站开发，个人开发娱乐</Footer>
                    </Layout>
                </Layout>
        )
    }
}

export default connect(
    state => ({user: state.user}),
    {}
)(Admin);
