function combineTwoAttribute(a1, a2){
    const attr1_values = Array.from(getAllValuesForOneNodeAttribute(a1));
    const attr2_values = Array.from(getAllValuesForOneNodeAttribute(a2));
    const heatmap_data = generate2DArray(attr1_values.length, attr2_values.length);

    function getIndexes(node, attr, value_list) {
        const indexes = []
        if (isListTypeAttribute(attr)){
            node[attr].forEach(value =>{
                indexes.push(value_list.indexOf(value))
            })
        }else {
            indexes.push(value_list.indexOf(node[attr]))
        }
        return indexes;
    }

    model.nodeDataArray.forEach(node => {
        const values1_indexes = getIndexes(node, a1, attr1_values);
        const values2_indexes = getIndexes(node, a2, attr2_values);
        values1_indexes.forEach(val1 =>{
            values2_indexes.forEach(val2 => {
                heatmap_data[val1][val2] += 1
            })
        })
    })

    generateHeatMap(attr2_values, attr1_values, heatmap_data, nodeSelectableAttributes.get(a1),  nodeSelectableAttributes.get(a2));

}


function generate2DArray(rows, cols) {
    var array = [], row = [];
    while (cols--) row.push(0);
    while (rows--) array.push(row.slice());
    return array;
}

function generateHeatMap(xValues, yValues, zValues, attr1Name, attr2Name) {

    var colorscaleValue = [
        [0, 'rgb(0,0,4)'],
        [0.13, 'rgb(31,12,72)'],
        [0.25, 'rgb(85,15,109)'],
        [0.38, 'rgb(136,34,106)'],
        [0.5, 'rgb(186,54,85)'],
        [0.63, 'rgb(227,89,51)'],
        [0.75, 'rgb(249,140,10)'],
        [0.88, 'rgb(249,201,50)'],
        [1, 'rgb(252,255,164)']
    ];


    var data = [{
        x: xValues,
        y: yValues,
        z: zValues,
        type: 'heatmap',
        colorscale: "RdBu",
        showscale: true
    }];

    var layout = {
        title: attr1Name+' vs. '+attr2Name+' Heatmap',
        annotations: [],
        xaxis: {
            ticks: '',
            side: 'top'
        },
        yaxis: {
            ticks: '',
            ticksuffix: ' ',
            width: 700,
            height: 700,
            autosize: false
        }
    };

    for (var i = 0; i < yValues.length; i++) {
        for (var j = 0; j < xValues.length; j++) {
            var currentValue = zValues[i][j];
            if (currentValue != 0.0) {
                var textColor = 'white';
            } else {
                var textColor = 'black';
            }
            var result = {
                xref: 'x1',
                yref: 'y1',
                x: xValues[j],
                y: yValues[i],
                text: zValues[i][j],
                font: {
                    family: 'Arial',
                    size: 12,
                    color: 'rgb(50, 171, 96)'
                },
                showarrow: false,
                font: {
                    color: textColor
                }
            };
            layout.annotations.push(result);
        }
    }

    Plotly.newPlot('diagramDiv', data, layout);

}

/*REMOVE AFTER STATS IS MERGED*/
/**
 * Returns true if a node attribute is a list attribute.
 * @param attribute
 * @returns {boolean}
 */
function isListTypeAttribute(attribute) {
    return ["tags", "departments"].includes(attribute); // Bad solution, don't have access to a template/schema?
}