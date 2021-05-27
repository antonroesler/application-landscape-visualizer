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
 * @author Feng Yi Lu, Anton Roesler, Leonard Husske
 */

/**
 * Convert the values of a JSON object into an array
 */
function ChipJsonValuesToArray(json) {
    let valueArray = [];

    for (let i in json) {
        valueArray.push(json[i]["tag"]);
    }
    return valueArray;
}


/**
 * Gets the input values from the user and calls the addNode() function to add
 * node to diagram.
 */
function readNodeProperties() {
    const name = document.getElementById("inputName").value;
    if (name === "") {
        window.alert("Please enter a name for the node");
    } else {
        const category = document.getElementById("inputCategory").value;
        const desc = document.getElementById("inputDescription").value;
        const tags = ChipJsonValuesToArray(M.Chips.getInstance(document.getElementById("inputTags")).chipsData);
        const departments = ChipJsonValuesToArray(M.Chips.getInstance(document.getElementById("inputDepartments")).chipsData);
        const version = document.getElementById("inputVersion").value;
        const license = document.getElementById("inputLicense").value;
        const profOwner = document.getElementById("inputProfessionalOwner").value;
        const techOwner = document.getElementById("inputTechnicalOwner").value;
        const startDate = document.getElementById("inputStartDate").value;
        const shutdownDate = document.getElementById("inputShutdownDate").value;
        if (appNodeNameExists(name) === true) {
            window.alert("Node name already exists.");
            return undefined
        }

        return { name: name, category: category, desc: desc, tags: tags, version: version, departments: departments, license: license,
            profOwner: profOwner, techOwner: techOwner, startDate: startDate, shutdownDate:shutdownDate}
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
    const category = document.getElementById("filterCategory").value;
    const tags = document.getElementById("filterTags").value;
    const version = document.getElementById("filterVersion").value;
    const department = document.getElementById("filterDepartment").value;
    const allowedUsers = document.getElementById("filterUsers").value;
    const license = document.getElementById("filterLicense").value;
    deleteEmtyField = [category, tags, version, department, allowedUsers, license];
    properties = {};
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