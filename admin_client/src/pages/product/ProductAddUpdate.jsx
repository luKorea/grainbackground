import React, {Component} from 'react';
import {
    Card,
    Icon,
    Form,
    Input,
    Cascader,
    Button,
    message
} from 'antd';
import LinkButton from './../../components/link-button';
import PictureWall from './PictureWall';
import RichTextEditor from './RichTextEditor';
import {reqCategory, reqAddOrUpdateProduct} from './../../api';

const {Item} = Form;
const {TextArea} = Input;


class ProductAddUpdate extends Component {

    constructor(props) {
        super(props);
        this.pw = React.createRef();
        this.ed = React.createRef();
    }

    state = {
        options: []
    };


    // 自定义校验规则
    validatorPrice = (rule, value, callback) => {
        if (value * 1 > 0) callback();
        else callback('价格必须大于0');

    };
    // TODO 提交数据
    submit = () => {
        // 进行表单验证, 如果通过了, 才发送请求
        this.props.form.validateFields(async (error, values) => {
            if (!error) {

                // 1. 收集数据, 并封装成product对象
                const {name, desc, price, categoryIds} = values;
                let pCategoryId, categoryId;
                if (categoryIds.length===1) {
                    pCategoryId = '0';
                    categoryId = categoryIds[0]
                } else {
                    pCategoryId = categoryIds[0];
                    categoryId = categoryIds[1]
                }
                const imgs = this.pw.current.getImgs();
                const detail = this.ed.current.getDetail();

                const product = {name, desc, price, imgs, detail, pCategoryId, categoryId};

                // 如果是更新, 需要添加_id
                if(this.isUpdate) {
                    product._id = this.product._id
                }

                // 2. 调用接口请求函数去添加/更新
                const result = await reqAddOrUpdateProduct(product);

                // 3. 根据结果提示
                if (result.status===0) {
                    message.success(`${this.isUpdate ? '更新' : '添加'}商品成功!`);
                    this.props.history.goBack()
                } else {
                    message.error(`${this.isUpdate ? '更新' : '添加'}商品失败!`)
                }
            }
        })
    };


    // TODO 初始化级联数据
    initOptions = async (category) => {
        const options = category.map(item => ({
            value: item._id,
            label: item.name,
            isLeaf: false
        }));
        // 如果是二级分类
        const {isUpdate, product} = this;
        const {pCategoryId, categoryId} = product;
        if (isUpdate && pCategoryId !== '0') {
            const subCategory = await this.getCategory(pCategoryId);
            const cOptions = subCategory.map(item => ({
                value: item._id,
                label: item.name,
                isLeaf: true
            }));
            const targetOptions = options.find(option => option.value === pCategoryId);
            targetOptions.children = cOptions;
        }
        this.setState({options});
    };

    // 获取级联数据
    getCategory = async (parentId) => {
        const result = await reqCategory(parentId);
        if (result.status === 0) {
            const category = result.data;
            // 一级分类列表
            if (parentId === '0') {
                this.initOptions(category);
            }
            // 二级列表
            else {
                return category;
            }
        }
    };
    // TODO 加载下一级的数据
    loadData = async (selectedOptions) => {
        const targetOption = selectedOptions[0];
        targetOption.loading = true;
        const subCategory = await this.getCategory(targetOption.value);
        targetOption.loading = false;
        if (subCategory && subCategory.length > 0) {
            // 子分类
            const cOptions = subCategory.map(item => ({
                value: item._id,
                label: item.name,
                isLeaf: true
            }));
            targetOption.children = cOptions;
        } else { // 当前分类没有二级分类
            targetOption.isLeaf = true;
        }
        this.setState({
            options: [...this.state.options]
        });
    };

    componentWillMount() {
        // 判断有股点击修改数据或添加数据
        const product = this.props.location.state;
        // 是否更新的标识
        this.isUpdate = !!product;
        // 保存商品，如果没有，保存空对象
        this.product = product || {};
    }

    componentDidMount() {
        this.getCategory('0');
    }

    render() {
        const {isUpdate, product} = this;
        // 用来接收级联分类ID的数据
        const categoryIds = [];
        const {pCategoryId, categoryId, imgs, detail} = product;
        // 一级分类
        if (pCategoryId === '0') {
            categoryIds.push(categoryId);
        } else {
            // 二级分类
            categoryIds.push(pCategoryId);
            categoryIds.push(categoryId);
        }
        const title = (
            <span>
                <LinkButton onClick={() => this.props.history.goBack()}>
                      <Icon type='arrow-left'/>
                </LinkButton>
                <span>{isUpdate ? '修改商品' : '添加商品'}</span>
            </span>
        );
        const {getFieldDecorator} = this.props.form;
        // 设置表单布局
        const formItemLayout = {
            labelCol: {span: 2},
            wrapperCol: {span: 8},
        };

        return (
            <Card title={title}>
                <Form {...formItemLayout}>
                    <Item label='商品名称'>
                        {
                            getFieldDecorator('name', {
                                initialValue: product.name,
                                rules: [{
                                    required: true,
                                    message: '名称必须输入'
                                }]
                            })(<Input placeholder='请输入商品名称'/>)
                        }
                    </Item>
                    <Item label='商品描述'>
                        {
                            getFieldDecorator('desc', {
                                initialValue: product.desc,
                                rules: [{
                                    required: true,
                                    message: '描述必须输入'
                                }]
                            })(
                                <TextArea placeholder='请输入商品描述' autosize={{minRows: 2, maxRows: 6}}/>
                            )
                        }
                    </Item>
                    <Item label='商品价格'>
                        {
                            getFieldDecorator('price', {
                                initialValue: product.price,
                                rules: [
                                    {required: true, message: '必须输入价格'},
                                    {validator: this.validatorPrice}
                                ]
                            })(<Input type='number' addonAfter='元' placeholder='请输入商品价格'/>)
                        }
                    </Item>
                    <Item label='商品分类'>
                        {
                            getFieldDecorator('categoryIds', {
                                initialValue: [],
                                rules: [{
                                    required: true,
                                    message: '必须指定分类'
                                }]
                            })(
                                <Cascader
                                    options={this.state.options}
                                    loadData={this.loadData}
                                    changeOnSelect
                                />
                            )
                        }
                    </Item>
                    <Item label='商品图片'>
                        <PictureWall ref={this.pw} imgs={imgs}/>
                    </Item>
                    <Item label='商品详情' labelCol={{span: 2}} wrapperCol={{span: 20}}>
                        <RichTextEditor ref={this.ed} detail={detail}/>
                    </Item>
                    <Button type='primary' onClick={this.submit}>添加商品</Button>
                </Form>
            </Card>
        )
    }
}

export default Form.create()(ProductAddUpdate);
