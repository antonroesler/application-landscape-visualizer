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
        if (["children", "parents", "neighbors"].includes(attribute)){
            addCounter(String(getNumberOf(attribute, node)), data)
        }
        else if (isListTypeAttribute(attribute)) {
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

function renderHistogramHandler() {
    const val = document.getElementById("histogram-dropdown").value;
    renderHistogram(val);

}

var Histogram = null;

async function renderHistogram(attribute) {
    const data = generateHistogramDataObject(attribute)
    const container = document.getElementById("histogram-container");
    container.innerHTML = "";
    const canvas = document.createElement("canvas");
    canvas.style.height = "100%";
    container.appendChild(canvas);
    const values = [];
    Object.keys(data).forEach(val => {
        values.push(data[val])
    })
    const res = await fetch("color?n=" + values.length);
    const colors = await res.json();
    var lastHoveredIndex = null;
    Histogram = new Chart(canvas, {
        type: "bar",
        data: {
            labels: Object.keys(data),
            datasets: [
                {
                    label: attribute,
                    data: values,
                    backgroundColor: colors,
                    borderColor: ["rgba(48, 48, 48, 1)"],
                    borderWidth: 2
                },
            ],
        },
        options: {
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
    });
    canvas.addEventListener('click', clickHandler);
}

function clickHandler(evt) {
    const points = Histogram.getElementsAtEventForMode(evt, 'nearest', {intersect: true}, true);
    if (points.length) {
        const attr_value = Histogram.data.labels[points[0].index];
        const attr = document.getElementById('histogram-dropdown').value
        const attr_name = nodeSelectableAttributes.get(document.getElementById('histogram-dropdown').value)
        const filter = {
            name: attr_name + " " + attr_value ,
            properties: {}
        }
        filter.properties[attr] = [attr_value];
        allFilter.push(filter);
        appendFilterCollection(generateFilterElement(filter));
        applyFilter(filter);

    }
}