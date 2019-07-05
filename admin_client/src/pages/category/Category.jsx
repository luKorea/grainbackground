import React, {Component} from 'react';
import {Card, Table, Button, Icon, Divider, message} from 'antd';
import LinkButton from './../../components/link-button';
import {reqCategory} from './../../api';

/**
 * TODO 商品分类路由
 */
class Category extends Component {

    state = {
        category: [],  // 一级分类列表
        subCategorys: [], // 二级分类列表
        loading: false,
        parentId: '0',  // 分类的ID
        parentName: '' // 分类名字
    };

    // 初始化列数
    initColumn = () => {
        this.columns = [
            {
                title: '分类名称',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '操作',
                key: 'action',
                width: 400,
                render: (category) => (
                    <span>
                          <LinkButton>修改分类</LinkButton>
                        {
                            this.state.parentId === '0'
                                ? (<span>
                                    <Divider type="vertical"/>
                                    <LinkButton onClick={() => {
                                        this.showSubCategory(category)
                                    }}>
                                        查看子分类
                                    </LinkButton>
                                </span>)
                                : null
                        }
                    </span>
                ),
            }
        ];
    };

    // TODO  获取分类数据
    getCategory = async () => {
        // 请求前
        this.setState({loading: true});
        const {parentId} = this.state;
        const data = await reqCategory(parentId);
        if (data.status === 0) {
            this.setState({loading: false});
            const category = data.data;
            // 获取一级分类的数据
            if (parentId === '0') this.setState({category});
            // 获取二级分类数据
            else this.setState({subCategorys: category});
        } else {
            message.error('获取分类信息失败');
        }
    };

    // 显示二级数据
    showSubCategory = (category) => {
        // 更新二级列表的数据
        this.setState({
            parentId: category._id,
            parentName: category.name
        }, () => {
            // 获取二级列表
            this.getCategory();
        });
    };
    // 显示一级数据
    showCategory = () => {
        this.setState({
            parentId: '0',
            parentName: '',
            subCategorys: []
        })
    };

    componentWillMount() {
        this.initColumn();
    }

    componentDidMount() {
        this.getCategory();
    }

    render() {
        const {category, loading, subCategorys, parentId, parentName} = this.state;
        const title = parentId === '0' ? '一级分类' : (
            <span>
                <LinkButton onClick={this.showCategory}>一级分类</LinkButton>
                <Divider type="vertical" />
                <span>{parentName}</span>
            </span>
        );
        const extra = (
            <Button type='primary'>
                <Icon type='plus'/>
                添加分类
            </Button>
        );
        return (
            <Card
                title={title}
                extra={extra}
            >
                <Table
                    dataSource={parentId === '0' ? category : subCategorys}
                    columns={this.columns}
                    bordered
                    loading={loading}
                    pagination={{defaultPageSize: 5, showQuickJumper: true}}
                    rowKey='_id'
                />
            </Card>
        )
    }
}

export default Category;
