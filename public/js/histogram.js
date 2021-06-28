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
 * Contains functions that calculate statistical data on the diagram and displays charts in the visualize Tab
 * @author Anton Roesler, Patrick Frech
 */


/* ============== Calculate Histogram Data on Attributes ============== */


/**
 * Returns a Object that shows the distribution of values of the specified attribute. E.g. Departments:
 * {
 *     Finance: 135,
 *     Data: 209,
 *     Development: 178,
 *     HR: 45,
 * }
 * @param attribute the fields name for the required data (departments, category, techOwner...)
 * @returns {HashMap type Object}
 */
function generateHistogramDataObject(attribute = "tags") {
    const data = {};

    model.nodeDataArray.forEach(node => {
        if (["children", "parents", "neighbors"].includes(attribute)){
            addCounter(String(getNumberOf(attribute, node)), data)
        }
        else if (isListTypeAttribute(attribute)) {
            node[attribute].forEach(value => {
                addCounter(value, data)
            })
        } else if (["shutdownDate", "startDate"].includes(attribute)) {
            addCounter(String(getYearOf(attribute, node)), data)
        }else {
            addCounter(node[attribute], data);
        }
    })
    return data;
}

/**
 * Returns true if a node attribute is a list attribute.
 * @param attribute
 * @returns {boolean}
 */
function isListTypeAttribute(attribute) {
    return ["tags", "departments"].includes(attribute); // Bad solution, don't have access to a template/schema?
}

/**
 * Increases the counter of the dataObject at the given value.
 * @param value
 * @param dataObject
 */
function addCounter(value, dataObject) {
    if (Object.keys(dataObject).includes(value)) {
        dataObject[value]++;
    } else {
        dataObject[value] = 1;
    }
}

/* ============== Calculate Histogram Data on Graph Statistics ============== */

/**
 *
 * @param relation
 * @param node
 * @returns {number}
 */
function getNumberOf(relation, node){
    if (relation === "parents"){
        return numberOfParentNodes(node)
    } else if (relation === "children"){
        return numberOfChildNodes(node)
    }
    return numberOfChildNodes(node) + numberOfParentNodes(node)
}

/**
 * Returns the number of parent nodes that a given node has.
 * @param node
 * @returns Number of parents of node
 */
function numberOfParentNodes(node) {
    const parents = new Set();
    const node_key = node.key;
    model.linkDataArray.forEach(link => {
        if (link.to === node_key) {
            parents.add(link.from);
        }
    })
    return parents.size;
}

/**
 * Returns the number of child nodes that a given node has.
 * @param node
 * @returns Number of child of node
 */
function numberOfChildNodes(node) {
    const children = new Set();
    const node_key = node.key;
    model.linkDataArray.forEach(link => {
        if (link.from === node_key) {
            children.add(link.to);
        }
    })
    return children.size;
}


/* ============== Render Histogram ============== */

let Histogram = null;

/**
 * Reads the chosen value from the dropdown and calls function to render the histogram.
 */
function renderHistogramHandler() {
    const val = document.getElementById("histogram-dropdown").value;
    renderHistogram(val);      
}


/**
 * Sorts two arrays dy the value array. Used for arrqys where labels[i] corresponds to values[i]
 * @param values
 * @param labels
 */
function sortByValues(values, labels) {
    console.log(values)
    //1) combine the arrays:
    const tempList = [];
    for (let j = 0; j < values.length; j++)
        tempList.push({'val': values[j], 'lab': labels[j]});

    //2) sort:
    tempList.sort(function (a, b) {
        return ((a.val > b.val) ? -1 : ((a.val === b.val) ? 0 : 1));
        //Sort could be modified to, for example, sort on the age
        // if the name is the same.
    });

    //3) separate them back out:
    for (let k = 0; k < values.length; k++) {
        labels[k] = tempList[k].lab;
        values[k] = tempList[k].val;
    }
}

/**
 * Renders a histogram in the Histogram Tab in the html for the specified attribute.
 * @param attribute (techOwner, tags...)
 */
function renderHistogram(attribute) {
    const data = generateHistogramDataObject(attribute)
    const canvas = generateHistogramHtmlElement()
    const labels = Object.keys(data);
    const values = extractValues(data);
    if (!["children", "parents", "neighbors", "shutdownDate", "startDate"].includes(attribute)) {
        sortByValues(values, labels);
    }


    Histogram = new Chart(canvas, configurePlotlyHistogram(labels, attribute, values));
}

/**
 * Returns an array of all values (not keys) form an object.
 * @param obj
 * @returns {String[]}
 */
function extractValues(obj){
    const values = [];
    Object.keys(obj).forEach(val => {
        values.push(obj[val])
    })
    return values;
}

/**
 * Clears the 'old' histogram and creates a 'fresh' html element to render the histogram on.
 * @returns {HTMLCanvasElement}
 */
function generateHistogramHtmlElement(){
    const container = document.getElementById("histogram-container");
    container.innerHTML = "";
    const canvas = document.createElement("canvas");
    container.style.height = '233px';
    container.appendChild(canvas);
    canvas.addEventListener('click', clickHandler);
    return canvas;
}

/**
 * Returns the configuration-object for a plotly bar chart with the specified data.
 * @param labels An array of strings the are the labels on the x-axis of each bar
 * @param title The title of the diagram
 * @param values An array of heights for each chart (must be same order as labels)
 * @returns {{data: {datasets: [{backgroundColor: string, data, label}], labels}, options: {plugins: {legend: {display: boolean}}, scales: {y: {beginAtZero: boolean}}}, type: string}}
 */
function configurePlotlyHistogram(labels, title, values){
    return {
        type: "bar",
            data: {
        labels: labels,
            datasets: [
            {
                label: title,
                data: values,
                backgroundColor: 'rgba(20, 124, 229, 0.8)'
            },
        ],
    },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                },
            },

        }
    }

}


/**
 * Handles click events on the histogram.
 * @param evt
 */
function clickHandler(evt) {
    const points = Histogram.getElementsAtEventForMode(evt, 'nearest', {intersect: true}, true);
    if (points.length) {
        createFilterFromHistogram(Histogram.data.labels[points[0].index]);
    }
}

/**
 * Creates a new filter based on the passed value (e.g. 'cloud') and the category that is selected in the dropdown
 * (e.g. 'tags').
 * @param attr_value The value of the filter - not the attribute (that is read from the dropdown)
 */
function createFilterFromHistogram(attr_value) {
    const attr = document.getElementById('histogram-dropdown').value
    const filter = createFilterObject(attr_value, attr);
    addAndApplyFilter(filter);
}

/**
 * Returns a filter object that can be added as a filter on the diagram. Only works for one-attribute and one-value
 * filter. (Click on Histogram/Heatmap)
 * @param attr_value The value that the filter should be created with (Lane, Cloud...)
 * @param attr The attribute that the filter id for (techOwner, tags...)
 * @returns {{name: string, properties: {}}} Filter Object
 */
function createFilterObject( attr_value, attr) {
    const attr_name = nodeSelectableAttributes.get(attr)
    const filter = {
        name: attr_name + " " + attr_value,
        properties: {}
    }
    filter.properties[attr] = [attr_value];
    return filter;
}

/* Date functions */

/**
 * Returns the year of an date type attribute for a node.
 * @param attribute ("shutdownDate", "startDate"...)
 * @param node a node object
 * @returns {string} The year ("2021" or "N/A" if empty)
 */
function getYearOf(attribute, node) {
    let year = "N/A";
    const value = node[attribute].substring(0,4);
    if (value){
        year = value;
    }
    return year;
}