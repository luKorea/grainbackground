import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {logout} from './../../redux/actions';
import {Modal} from 'antd';

import LinkButton from '../link-button';
import {reqWeather} from '../../api';
import {formateDate} from '../../utils/dateUtils';
import './topnav.less';

/*
左侧导航的组件
 */
class TopNav extends Component {

    state = {
        currentTime: formateDate(Date.now()), // 当前时间字符串
        dayPictureUrl: '', // 天气图片url
        weather: '', // 天气的文本
    };

    // TODO 设置时间
    getTime = () => {
        // 每隔1s获取当前时间, 并更新状态数据currentTime
        this.intervalId = setInterval(() => {
            const currentTime = formateDate(Date.now());
            this.setState({currentTime})
        }, 1000)
    };

    // TODO 获取天气
    getWeather = async () => {
        // 调用接口请求异步获取数据
        const {dayPictureUrl, weather} = await reqWeather('北京');
        // 更新状态
        this.setState({dayPictureUrl, weather})
    };

    // TODO 退出登录
    logout = () => {
        // 显示确认框
        Modal.confirm({
            content: '确定退出吗?',
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
                // 删除保存的user数据
                this.props.logout();
            }
        })
    };

    /*
    第一次render()之后执行一次
    一般在此执行异步操作: 发ajax请求/启动定时器
     */
    componentDidMount() {
        // 获取当前的时间
        this.getTime();
        // 获取当前天气
        this.getWeather()
    }

    /*
    当前组件卸载之前调用
     */
    componentWillUnmount() {
        // 清除定时器
        clearInterval(this.intervalId)
    }


    render() {

        const {currentTime, dayPictureUrl, weather} = this.state;

        const username = this.props.user.username;

        // 得到当前需要显示的title
        const title = this.props.headerTitle;
        return (
            <div className="header">
                <div className="header-top">
                    <span>欢迎, {username}</span>
                    <LinkButton onClick={this.logout}>退出</LinkButton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">{title}</div>
                    <div className="header-bottom-right">
                        <span>{currentTime}</span>
                        <img src={dayPictureUrl} alt="weather"/>
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(
    state => ({
        headerTitle: state.headerTitle,
        user: state.user
    }),
    {logout}
)(withRouter(TopNav));
