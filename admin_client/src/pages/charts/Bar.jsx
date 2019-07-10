import React, {Component} from 'react';
import {Card, Button} from 'antd';
import ReactEcharts from 'echarts-for-react';

/**
 * 条状图路由
 */
class Bar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            salesVolume: [5, 20, 36, 10, 10, 20],
            Stock: [10, 15, 20, 25, 30, 10]
        }
    }

    update = () => {
      this.setState(state => ({
         salesVolume: state.salesVolume.map(sale => sale + 1),
         Stock: state.Stock.map(stock => stock - 1)
      }));
    };

    getOption = (salesVolume, Stock) => {
        return {
            title: {
                text: 'ECharts 入门示例'
            },
            tooltip: {},
            legend: {
                data:['销量', '库存']
            },
            xAxis: {
                data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
            },
            yAxis: {},
            series: [
                {
                name: '销量',
                type: 'bar',
                data: salesVolume
                },
                {
                    name: '库存',
                    type: 'bar',
                    data: Stock
                }
            ]
        }
    };

    render() {
        const {salesVolume, Stock} = this.state;
        return (
            <div>
                <Card>
                    <Button type='primary' onClick={this.update}>更新</Button>
                </Card>
                <Card title='柱状图实例'>
                    <ReactEcharts
                        option={this.getOption(salesVolume, Stock)}
                    />
                </Card>
            </div>
        )
    }
}

export default Bar;
