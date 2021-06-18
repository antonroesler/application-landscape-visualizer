/*
* Copyright (c) 2021 Ecore. All rights reserved.
*
* University:        Frankfurt University of Applied Sciences
* Study program:     Engineering Business Information Systems
* Module:            Advanced Programming 2021
* Professor:         Prof. Dr. Jung, Prof. Dr. Bremm
* Date:              21.04.2021
*
*/

/**
 * Contains all functions that are used to generate and render the heatmap.
 *
 * @author Anton Roesler, Leonard Hußke
 */


/**
 * Entrypoint-function that is called to by the click on the generate heatmap button.
 */
function heatmap() {
    try {
        _heatmap();
        createToast("Heatmap generated", "success");
    } catch (e) {
        console.log(e);
        createToast(e, "fail");
    }
}

/**
 * Handles the generation of the heatmap. Reads values from html inputs and triggers the generation of the actual heatmap.
 * Also it hides the diagram and displays the heatmap div.
 */
function _heatmap() {
    hideHTMLElement(document.getElementById('diagramDiv'));
    showHTMLElement(document.getElementById('heatmap'))
    const a1 = document.getElementById('heatmap-attribute1').value;
    const a2 = document.getElementById('heatmap-attribute2').value;
    const schema = document.getElementById('heatmap-color').value;
    if (isValidAttribute([a1, a2])) {
        const attr1_values = Array.from(getAllValuesForOneNodeAttribute(a1));
        const attr2_values = Array.from(getAllValuesForOneNodeAttribute(a2));
        const heatmap_data = generateHeatmapData(attr1_values, attr2_values, a1, a2);

        generateHeatMap(attr2_values, attr1_values, heatmap_data, nodeSelectableAttributes.get(a1), nodeSelectableAttributes.get(a2), schema);
    } else {
        throw "Attribute is not valid."
    }
}

/**
 * Generates the combination matrix for two attributes.
 * @param attr1_values
 * @param attr2_values
 * @param a1
 * @param a2
 * @returns {[[],[]...]} combination matrix
 */
function generateHeatmapData(attr1_values, attr2_values, a1, a2) {
    const heatmap_data = generate2DArray(attr1_values.length, attr2_values.length);

    function getIndexes(node, attr, value_list) {
        const indexes = []
        if (isListTypeAttribute(attr)) {
            node[attr].forEach(value => {
                indexes.push(value_list.indexOf(value))
            })
        } else {
            indexes.push(value_list.indexOf(node[attr]))
        }
        return indexes;
    }

    model.nodeDataArray.forEach(node => {
        const values1_indexes = getIndexes(node, a1, attr1_values);
        const values2_indexes = getIndexes(node, a2, attr2_values);
        values1_indexes.forEach(val1 => {
            values2_indexes.forEach(val2 => {
                heatmap_data[val1][val2] += 1
            })
        })
    })
    return heatmap_data;
}

/**
 * Checks if a list of attribute names are all valid attribute names ('techOwner', 'tags'...)
 * @param attrs Array of strings
 * @returns {boolean}
 */
function isValidAttribute(attrs) {
    let validity = true;
    attrs.forEach(attr => {
        if (!Array.from(nodeSelectableAttributes.keys()).includes(attr)) {
            validity = false;
        }
    })
    return validity;
}

/**
 * Generates a 2D-Zeros-Array of size rows*cols
 * @param rows
 * @param cols
 * @returns {*[]}
 */
function generate2DArray(rows, cols) {
    var array = [], row = [];
    while (cols--) row.push(0);
    while (rows--) array.push(row.slice());
    return array;
}

/**
 * Generates a heatmap from given data and displays it in the html.
 * @param xValues Array of X values
 * @param yValues Array of Y values
 * @param zValues 2D-Array of Z Values
 * @param attr1Name Name of Attribute1 (User readable name for title)
 * @param attr2Name Name of Attribute2 (User readable name for title)
 * @param schema Name of the color schema ('inferno', 'greens'...)
 */
function generateHeatMap(xValues, yValues, zValues, attr1Name, attr2Name, schema) {
    var data = [{
        x: xValues,
        y: yValues,
        z: zValues,
        type: 'heatmap',
        colorscale: getSchema(schema),
        showscale: true
    }];

    var layout = {
        title: attr1Name + ' vs. ' + attr2Name + ' Heatmap',
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
            var result = {
                xref: 'x1',
                yref: 'y1',
                x: xValues[j],
                y: yValues[i],
                text: zValues[i][j],
                font: {
                    family: 'Montserrat',
                    size: 12,
                    color: 'rgb(50, 171, 96)'
                },
                showarrow: false,
            };
            layout.annotations.push(result);
        }
    }
    const plot = document.getElementById('heatmap')
    Plotly.newPlot(plot, data, layout);

    /* Click event on heatmap pot */
    plot.on('plotly_click', clickHeatmap);

    /* Change cursor style to pointer when hovering */
    dragLayer = document.getElementsByClassName('nsewdrag')[0]
    plot.on('plotly_hover', function(data){
        dragLayer.style.cursor = 'pointer'
    });
}

/* HEATMAP CLICK */
/**
 * Handles a click on the heatmap by creating two filters according to the clicked field in the heatmap.
 * @param data Click event data
 */
function clickHeatmap(data) {
    const f1_value = data.points[0].y
    const f2_value = data.points[0].x
    const f1_attr = document.getElementById('heatmap-attribute1').value;
    const f2_attr = document.getElementById('heatmap-attribute2').value;
    addAndApplyFilter(createFilterObject(f1_value, f1_attr))
    addAndApplyFilter(createFilterObject(f2_value, f2_attr))
}

/**
 * Function to close the heatmap and display the diagram.
 */
function closeHeatmap() {
    showHTMLElement(document.getElementById('diagramDiv'));
    hideHTMLElement(document.getElementById('heatmap'))
}

/* HEATMAP COLOR SCHEMAS */
function getSchema(schemaName) {
    if (schemaName.toLowerCase() === "inferno") {
        return [
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
    } else return schemaName;
}