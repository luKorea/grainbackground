import React, {Component} from 'react';
import {
    Select,
    Card,
    Table,
    Icon,
    Button,
    Input,
    Divider,
    message
} from 'antd';
import LinkButton from './../../components/link-button';
import {reqProducts, reqSearchProducts, reqUpdateStatus} from './../../api';
import {PAGE_SIZE} from './../../utils/constants';

const Options = Select.Option;

class ProductHome extends Component {

    state = {
        products: [],
        total: 0,
        loading: false,
        searchName: '',  // 搜索的內容
        searchType: 'productName' // 搜索的類型
    };
    initColumns = () => {
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name',
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
            },
            {
                title: '价格',
                dataIndex: 'price',
                render: (price) => '¥' + price  // 当前指定了对应的属性, 传入的是对应的属性值
            },
            {
                width: 200,
                title: '状态',
                // dataIndex: 'status',
                render: (product) => {
                    const {status, _id} = product;
                    const newStatus = status === 1 ? 2 : 1;
                    return (
                        <span>
                            <Button type='primary' onClick={() => {this.updateStatus(_id, newStatus)}}>{status === 1 ? '下架' : '上架'}</Button>
                            <Divider type='vertical' />
                            <span>{status === 1 ? '在售' : '已下架'}</span>
                        </span>)
                }
            },
            {
                width: 150,
                title: '操作',
                render: (product) => {
                    return (<span>
                      {/*将product对象使用state传递给目标路由组件*/}
                      <LinkButton onClick={() => this.props.history.push('/product/details', {product})}>详情</LinkButton>
                       <Divider type='vertical' />
                      <LinkButton onClick={() => this.props.history.push('/product/add', product)}>修改</LinkButton>
                    </span>
                    )
                }
            },
        ];
    };

    // TODO 获取商品，搜索商品分页显示

    getProducts = async (pageNum) => {
        this.pageNum = pageNum;
        let result;
        this.setState({loading: true});
        const {searchName, searchType} = this.state;
        if (searchName) {
            //  搜索数据渲染
            result = await reqSearchProducts({pageNum, pageSize: PAGE_SIZE, searchType, searchName});
        } else {
            // 数据渲染
            result = await reqProducts(pageNum, PAGE_SIZE);
        }

        // 取出分页数据，更新状态，显示分页列表
        if (result.status === 0) {
            const {list, total} = result.data;
            this.setState({
                products: list,
                total,
                loading: false
            })
        }
    };

    // 更新指定商品的状态
    updateStatus = async (productId, status) => {
        const result = await reqUpdateStatus(productId, status);
        if (result.status === 0) {
            message.success('商品状态更新成功');
            this.getProducts(this.pageNum);
        }
    };

    componentWillMount() {
        this.initColumns();
    }
    componentDidMount() {
        this.getProducts();
    }

    render() {
        const {products, total, loading, searchType, searchName} = this.state;
        const title = (
            <span>
                <Select
                    value={searchType}
                    onChange={value => {this.setState({searchType: value})}}
                >
                    <Options value='productName'>按名称搜索</Options>
                    <Options value='productDesc'>按描述搜索</Options>
                </Select>
                <Input
                    placeholder='关键字'
                    style={{width: 300, margin: '0 10px'}}
                    value={searchName}
                    onChange={event => {this.setState({searchName: event.target.value})}}
                />
                <Button type='primary' onClick={() => this.getProducts(1)}>
                    <Icon type='search'/>
                    搜索
                </Button>
            </span>
        );
        const extra = (
            <Button type='primary' onClick={() =>this.props.history.push('/product/add')} >
                <Icon type='plus'/>
                添加商品
            </Button>
        );
        return (
            <Card title={title} extra={extra}>
                <Table
                    dataSource={products}
                    columns={this.columns}
                    bordered
                    pagination={{
                        total,
                        defaultPageSize: PAGE_SIZE,
                        showQuickJumper: true,
                        onChange: this.getProducts
                    }}
                    rowKey='_id'
                    loading={loading}
                />
            </Card>
        )
    }
}

export default ProductHome;
