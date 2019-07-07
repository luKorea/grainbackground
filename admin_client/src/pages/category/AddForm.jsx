import React, {Component} from 'react';
import {
    Form,
    Select,
    Input
} from 'antd';
import PropTypes from 'prop-types';


const Item = Form.Item;
const Option = Select.Option;

class AddForm extends Component {

    static propTypes = {
        category: PropTypes.array.isRequired,
        parentId: PropTypes.string.isRequired,
        setForm: PropTypes.func.isRequired
    };

    componentWillMount() {
        this.props.setForm(this.props.form);
    }

    render() {

        const {category, parentId} = this.props;
        const {getFieldDecorator} = this.props.form;

        return (
            <Form>
                <Item label='分类列表'>
                {
                    getFieldDecorator('parentId',{
                        initialValue: parentId
                    })(
                            <Select>
                                <Option value='0'>一级分类</Option>
                                {
                                    category.map(item => <Option value={item._id} key={item._id}>{item.name}</Option>)
                                }
                            </Select>

                    )
                }
                </Item>

                <Item label='分类名称'>
                {
                    getFieldDecorator('categoryName')(
                            <Input placeholder='请输入分类名称' />
                    )
                }
                </Item>
            </Form>
        )
    }
}

export default Form.create({})(AddForm);
