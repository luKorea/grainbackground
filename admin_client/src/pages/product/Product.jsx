import React, {Component} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import ProductHome from './ProductHome';
import ProductAddUpdate from './ProductAddUpdate';
import ProductDetails from './ProductDetails';
import './index.less';
/**
 * TODO  商品路由
 */

class Product extends Component {
    render() {
        return (
            <Switch>
                <Route exact path='/product' component={ProductHome} />
                <Route exact path='/product/add' component={ProductAddUpdate} />
                <Route exact path='/product/details' component={ProductDetails} />
                <Redirect to='/product' />
            </Switch>
        )
    }
}

export default Product;
