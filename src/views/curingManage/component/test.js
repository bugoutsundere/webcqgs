let state = {
    dataList: [200, 182, 191, 234, 290, 330, 310],
    dataArray: [],
    dataArray2: [],
}
let aar = [], aar2 = [];
state.dataList.map((item, index) => {
    let obj = {
        value: item,
        itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                offset: 0,
                color: '#FF3333' // 0% 处的颜色
            }, {
                offset: 0.6,
                color: '#FF8888' // 60% 处的颜色
            }, {
                offset: 1,
                color: '#FFCCCC' // 100% 处的颜色
            }], false),

        }
    };
    aar.push(Object.assign({}, obj))
});
state.dataList.map((item, index) => {
    let obj = {
        value: item,
        itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                offset: 0,
                color: '#FF3333' // 0% 处的颜色
            }, {
                offset: 0.6,
                color: '#FF8888' // 60% 处的颜色
            }, {
                offset: 1,
                color: '#FFCCCC' // 100% 处的颜色
            }], false),
            borderWidth: 1,
            shadowColor: 'rgba(0, 0, 0, 0.2)',
            shadowBlur: 1,
        }
    };
    aar2.push(Object.assign({}, obj))
});
console.log('')
console.log(aar)
let barWidth = 800 / 40;
option = {
    backgroundColor: '#010d3a',
    xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        axisLine: {
            lineStyle: {
                color: '#fff'
            }
        }
    },
    yAxis: {
        type: 'value',
        axisLine: {
            lineStyle: {
                color: '#fff'
            }
        }
    },
    tooltip: {
        show: true,
        orient: 'vertical',
        formatter: '{b0}: {c0}'
    },
    series: [
        {
            name: 'test1',
            type: 'bar',
            barWidth: barWidth,
            z: 1,
            data: [200, 182, 191, 234, 290, 330, 310],
            color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                offset: 0,
                color: '#FF3333' // 0% 处的颜色
            }, {
                offset: 0.6,
                color: '#FF8888' // 60% 处的颜色
            }, {
                offset: 1,
                color: '#FFCCCC' // 100% 处的颜色
            }], false),
        },
        {
            name: 'test1',
            z: 3,
            type: 'pictorialBar',
            symbolPosition: 'start',
            symbol: 'diamond',
            symbolOffset: [0, '55%'],
            symbolSize: [barWidth, barWidth * 0.5],
            silent: true,
            data: [200, 182, 191, 234, 290, 330, 310],
            itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                    offset: 0,
                    color: '#FF3333' // 0% 处的颜色
                }, {
                    offset: 0.6,
                    color: '#FF8888' // 60% 处的颜色
                }, {
                    offset: 1,
                    color: '#FFCCCC' // 100% 处的颜色
                }], false),
                borderWidth: 1,
                shadowColor: 'rgba(0, 0, 0, 0.2)',
                shadowBlur: 1,
            }
        },
        {
            name: 'test1',
            z: 3,
            type: 'pictorialBar',
            symbolPosition: 'end',
            symbol: 'diamond',
            symbolOffset: [0, '-55%'],
            symbolSize: [barWidth, barWidth * 0.5],
            silent: true,
            data: [200, 182, 191, 234, 290, 330, 310],
            itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                    offset: 0,
                    color: '#FF3333' // 0% 处的颜色
                }, {
                    offset: 0.6,
                    color: '#FF8888' // 60% 处的颜色
                }, {
                    offset: 1,
                    color: '#FFCCCC' // 100% 处的颜色
                }], false),
                borderWidth: 1,
                shadowColor: 'rgba(0, 0, 0, 0.2)',
                shadowBlur: 1,
            }
        },
    ]
};