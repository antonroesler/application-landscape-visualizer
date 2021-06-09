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


/* ============== Calculate Histogram Data ============== */

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