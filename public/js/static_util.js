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
 * Contains all functions that read or write html or css properties.
 *
 * @author Feng Yi Lu, Anton Roesler
 */


/**
 * Gets the input values from the user and calls the addNode() function to add
 * node to diagram.
 */
function readNodeProperties() {
    const name = document.getElementById("createName").value;
    if (name === "") {
        window.alert("Please enter a name for the node");
    } else {
        const category = document.getElementById("createCategory").value;
        const desc = document.getElementById("createDesc").value;
        const tags = document.getElementById("tags").value;
        const version = document.getElementById("version").value;
        const department = document.getElementById("department").value;
        const allowedUsers = document.getElementById("allowedUsers").value;
        const license = document.getElementById("license").value;
        if (appNodeNameExists(name) === true) {
            window.alert("node name already exists");
            return undefined
        }
        return { name: name, category: category, desc: desc, tags: tags, version: version, department: department, allowedUsers: allowedUsers, license: license }
    }
}




/**
 * Checks if the given name for the new node is already existing or not
 */
function appNodeNameExists(name) {
    for (let i = 0; i < model.nodeDataArray.length; i++) {
        if (name === model.nodeDataArray[i].nameProperty) {
            return true;
        }
    }
    return false;
}

/** function to read filter properties*/
function readFilterProperties() {
    const filterName = document.getElementById("filterName").value;
    const category = document.getElementById("filterCategory").value;
    const tags = document.getElementById("filterTags").value;
    const version = document.getElementById("filterVersion").value;
    const department = document.getElementById("filterDepartment").value;
    const allowedUsers = document.getElementById("filterUsers").value;
    const license = document.getElementById("filterLicense").value;
    deleteEmtyField = [category, tags, version, department, allowedUsers, license];
    properties = {};
    properties.filterName = filterName;
    deleteEmtyField.forEach(function (property, i) {
        if (property != "" && i === 0) {
            properties.category = property;
        } else if (property != "" && i === 1) {
            properties.tags = property;
        } else if (property != "" && i === 2) {
            properties.version = property;
        } else if (property != "" && i === 3) {
            properties.department = property;
        } else if (property != "" && i === 4) {
            properties.allowedUsers = property;
        } else if (property != "" && i === 5) {
            properties.license = property;
        }
    });
    return properties;
}