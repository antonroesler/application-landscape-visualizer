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
 * @author Anton Roesler
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
        if (isListTypeAttribute(attribute)) {
            node[attribute].forEach(value => {
                addCounter(value, data)
            })
        } else {
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
 * Returns the number of parent nodes that a given node has.
 * @param node
 * @returns Number of parents of node
 */
function numberOfParentNodes(node){
    const parents = new Set();
    const node_key = node.key;
    model.linkDataArray.forEach(link => {
        if (link.to === node_key){
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
function numberOfChildNodes(node){
    const parents = new Set();
    const node_key = node.key;
    model.linkDataArray.forEach(link => {
        if (link.from === node_key){
            parents.add(link.to);
        }
    })
    return parents.size;
}


function renderHistogramHandler(){
    const val = document.getElementById("histogram-dropdown").value;
    renderHistogram(val);

}


async function renderHistogram(attribute){
    const data=generateHistogramDataObject(attribute)

    const container = document.getElementById("histogram-container");
    container.innerHTML="";
    const canvas = document.createElement("canvas");
    canvas.style.height = "100%";
    container.appendChild(canvas);
    const values = [];
    Object.keys(data).forEach(val=>{
        values.push(data[val])
    })
    const res = await fetch("color?n="+values.length);
    const colors = await res.json();

    var myChart = new Chart(canvas, {
        type: "bar",
        data: {
            labels: Object.keys(data),
            datasets: [
                {
                    label: attribute,
                    data: values,
                    backgroundColor:colors,
                    borderColor:["rgba(48, 48, 48, 1)"],
                    borderWidth: 2
                },
            ],
        },
        options: {
            plugins:{
                legend:{
                    display: false,
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });
}