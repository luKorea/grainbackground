import React, {Component} from 'react';
import {Card, Table, Button, Icon, Divider, message, Modal} from 'antd';
import AddForm from './AddForm';
import UpdateForm from './UpdateForm';
import LinkButton from './../../components/link-button';
import {reqCategory, reqUpdateCategory, reqAddCategory} from './../../api';

/**
 * TODO 商品分类路由
 */
class Category extends Component {

    state = {
        category: [],  // 一级分类列表
        subCategorys: [], // 二级分类列表
        loading: false,
        parentId: '0',  // 分类的ID
        parentName: '', // 分类名字
        status: 0   // 确认框状态，影藏为0， 添加为1，更新为2
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
                          <LinkButton
                              onClick={() => {this.update(category)}}
                          >
                              修改分类
                          </LinkButton>
                        {
                            this.state.parentId === '0'
                                ? (<span>
                                    <Divider type="vertical"/>
                                    <LinkButton
                                        onClick={() => {this.showSubCategory(category)}}
                                    >
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

    // TODO 获取分类数据
    getCategory = async (parentId) => {
        // 请求前
        this.setState({loading: true});
        parentId = parentId || this.state.parentId;
        const data = await reqCategory(parentId);
        if (data.status === 0) {
            this.setState({loading: false});
            const category = data.data;
            console.log(category);
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

    // TODO 关闭模态框
    handleCancel = () => {
        this.setState({status: 0});
    };

    // TODO 添加分类
    add = () => { this.setState({status: 1}); };
    addCategory = async () => {
        this.handleCancel();
        const {parentId, categoryName} = this.form.getFieldsValue();
        const result = await reqAddCategory({categoryName, parentId});
        if (result.status === 0){
            message.success('添加分類成功');
            this.getCategory();
        }
    };

    // TODO 更新分类
    update = (category) => {
        // 保存分类对象
        this.categoryName = category;
        // 更新状态
        this.setState({status: 2});
    };
    updateCategory = async () => {
        // 隐藏模态框
        this.handleCancel();
        // 数据准备
        const categoryId = this.categoryName._id;
        const categoryName = this.form.getFieldValue('categoryName');
        // 发送请求
        const result = await reqUpdateCategory({categoryId, categoryName});
        if (result.status === 0) {
               message.success('更新分類成功');
               // 重新渲染数据
               this.getCategory();
        }
    };

    componentWillMount() {
        this.initColumn();
    }

    componentDidMount() {
        this.getCategory();
    }

    render() {
        const {category, loading, subCategorys, parentId, parentName, status} = this.state;
        const  categoryName = this.categoryName || {};
        const title = parentId === '0' ? '一级分类' : (
            <span>
                <LinkButton onClick={this.showCategory}>一级分类</LinkButton>
                <Divider type="vertical"/>
                <span>{parentName}</span>
            </span>
        );
        const extra = (
            <Button type='primary' onClick={this.add}>
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

                {/* TODO 模态框 清除緩存數據 */}
                {
                    status &&
                    <Modal
                        title="添加分类"
                        visible={status === 1}
                        onOk={this.addCategory}
                        onCancel={this.handleCancel}
                        okText="确认"
                        cancelText="取消"
                    >
                        <AddForm
                            category={category}
                            parentId={parentId}
                            setForm={(form) => this.form = form}
                        />
                    </Modal>
                }
                {
                    status &&
                    <Modal
                        title="更新分类"
                        visible={status === 2}
                        onOk={this.updateCategory}
                        onCancel={this.handleCancel}
                        okText="确认"
                        cancelText="取消"
                    >
                        <UpdateForm
                            categoryName={categoryName.name}
                            setForm={(form) => {this.form =form}}
                        />
                    </Modal>
                }
            </Card>
        )
    }
}

export default Category;
