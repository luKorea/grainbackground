import React, {Component} from 'react';
import {Card, List, Icon} from 'antd';
import LinkButton from './../../components/link-button';
import {BASE_IMG_URL} from './../../utils/constants';
import {reqCategoryId} from './../../api';

const Item = List.Item;

class ProductDetails extends Component {

    state = {
        cName1: '',
        cName2: ''
    };

    // TODO 获取分类ID
    async componentDidMount() {
        // 得到当前分类ID以及父分类ID
        const {pCategoryId, categoryId} = this.props.location.state.product;
        if (pCategoryId === '0') {
            // 一级分类下的商品
            const result = await reqCategoryId(categoryId);
            if (result.status === 0) {
                const cName1 = result.data.name;
                this.setState({cName1});
            }
        } else {
            // 二级分类下的商品

            /*
            TODO 性能低，后一个请求必须等前一个请求处理成功后才执行
            const result1 = await reqCategoryId(pCategoryId);
            const result2 = await reqCategoryId(categoryId);
            */
            //  方案优化
            const results = await Promise.all([reqCategoryId(pCategoryId), reqCategoryId(categoryId)]);
           if (results.status === 0) {
               const cName1 = results[0].data.name;
               const cName2 = results[1].data.name;
               this.setState({
                   cName1,
                   cName2
               });
           }
        }
    }

    render() {

        const {name, desc, price, detail, imgs, cName1, cName2} = this.props.location.state.product;

        const title = (
            <span>
               <LinkButton>
                    <Icon
                        type='arrow-left'
                        onClick={() => this.props.history.goBack()}
                    />
               </LinkButton>
                <span>商品详情</span>
            </span>
        );

        return (
            <Card title={title} className='details-container'>
                <List>
                    <Item>
                        <span className='details-name'>商品名称:</span>
                        <span className='details-desc'>{name}</span>
                    </Item>
                    <Item>
                        <span className='details-name'>商品描述:</span>
                        <span className='details-desc'>{desc}</span>
                    </Item>
                    <Item>
                        <span className='details-name'>商品价格:</span>
                        <span className='details-desc'>{price}元</span>
                    </Item>
                    <Item>
                        <span className='details-name'>所属分类:</span>
                        <span className='details-desc'>
                            {cName1}{cName2 ? '-->' + cName2 : ''}
                        </span>
                    </Item>
                    <Item>
                        <span className='details-name'>商品图片:</span>
                        <span className='details-desc'>
                            {
                                imgs.map(img => (
                                    <img
                                        className='details-img'
                                        key={img}
                                        src={BASE_IMG_URL + img}
                                        alt="img desc"
                                    />
                                ))
                            }
                        </span>
                    </Item>
                    <Item>
                        <span className='details-name'>商品详情:</span>
                        <span dangerouslySetInnerHTML={{__html: detail}}></span>
                    </Item>
                </List>
            </Card>
        )
    }
}

export default ProductDetails;
