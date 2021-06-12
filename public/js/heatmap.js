function combineTwoAttribute(){


}

function generateHeatMap() {
    var xValues = ['A', 'B', 'C', 'D', 'E'];

    var yValues = ['W', 'X', 'Y', 'Z'];

    var zValues = [
        [0.00, 0.00, 0.33, 0.44, 0.55],
        [0.10, 0.22, 0.42, 0.47, 0.59],
        [0.21, 0.29, 0.75, 0.76, 0.88],
        [0.22, 0.30, 0.35, 0.45, 1]
    ];

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
        colorscale: colorscaleValue,
        showscale: true
    }];

    var layout = {
        title: 'Annotated Heatmap',
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