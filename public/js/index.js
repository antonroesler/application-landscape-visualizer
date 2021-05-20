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
 * A short description what this file/class is all about.
 * @author Leonard Hußke , Feng Yi Lu, Anton Roesler
 * this file contains several functions that are needed to display and interact
 * with the Diagram Canvas in the HTML File ()
 */

const URL = 'http://localhost:8000'
const $ = go.GraphObject.make;
const diagram = $(go.Diagram, "diagramDiv",
    { // enable Ctrl-Z to undo and Ctrl-Y to redo
        "undoManager.isEnabled": true,
        "toolManager.hoverDelay": 100
    });
const model = $(go.GraphLinksModel);
model.nodeDataArray = [];
model.linkDataArray = [];
const diagramNames = [];
var modelWithoutFilter = [];
var allFilter = [];
/**
 * init function to create the model.
 */
function init() {
    diagram.model = model;
    // passing our Template Maps into our diagram
    diagram.nodeTemplate = mainTemplate;
    diagram.linkTemplateMap = linkTemplateMap;
    diagram.layout = $(go.GridLayout);
}

/**
 * Saves a AppNode in the database and adds it to the canvas.v0.js
 */
function addAppNode() {
    const data = readNodeProperties();
    data._id = Date.now();
    addNodeToDiagram(data);
}

function addNodeToDiagram(data) {
    diagram.startTransaction("make new node");
    //if (category ==="Application"){var color = "blue"}
    //custom color setting for user
    model.addNodeData({
        key: data._id,
        nameProperty: data.name,
        category: data.category,
        desc: data.desc,
        tags: data.tags,
        version: data.version,
        department: data.department,
        allowedUsers: data.allowedUsers,
        license: data.license,
        //color: color
    });
    diagram.commitTransaction("update");
    modelWithoutFilter = model.nodeDataArray;
}
/**
 * Delete selected node from nodeDataArray.
 */
function deleteNode() {
    const id = diagram.selection.toArray()[0].key;
    const node = diagram.findNodeForKey(id);
    diagram.startTransaction();
    diagram.remove(node);
    diagram.commitTransaction("deleted node");
}


/** function to rerange model.nodeDataArray according to the filter properties */
function filterAppNodes() {
    const filter = readFilterProperties()
    filterArray = model.nodeDataArray.filter(function (currentElement) {
        for (var key in filter) {
            if (currentElement[key] === undefined || currentElement[key] != filter[key])
                return false;
        }
        return true;
    });

    if (filterArray.length === 0) {
        window.alert("there are no Nodes with this setting");
    } else {
        diagram.startTransaction();
        model.nodeDataArray = filterArray;
        diagram.commitTransaction("filter applied");
    }
}



/** function to remove filter */
function filterOff() {
    diagram.startTransaction();
    model.nodeDataArray = modelWithoutFilter;
    diagram.commitTransaction("filter removed");

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
 * Loads a diagram from the database. The diagram must be specified by name.
 *
 */
async function loadDiagram() {
    diagram.startTransaction();
    model.nodeDataArray = [];
    model.linkDataArray = [];
    diagram.commitTransaction("empty array");
    const name = document.getElementById("loadCategory").value;
    const url = urljoin(URL, 'mongo/' + name);
    const res = await fetch(url);
    const loadDiagram = await res.json();
    loadDiagram.nodeDataArray.forEach(node => {
        addNodeToDiagram(node);
    });
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

/**
 * Loads all diagram names that exist in the database as an array.
 */
async function loadDiagramNames() {
    const url = urljoin(URL, 'mongo/diagram/names');
    const res = await fetch(url);
    res.json().then(diagrams => {
        let i;
        const select = document.getElementById("loadCategory");
        const length = select.options.length;
        for (i = length - 1; i >= 0; i--) {
            select.options[i] = null;
        }
        for (i = 0; i < diagrams.length; i++) {
            const opt = diagrams[i];
            const el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            select.appendChild(el);
        }
    });

}

/**
 * Saves the model
 * @returns {Promise<void>}
 */
async function saveDiagram() {
    const url = urljoin(URL, 'mongo');
    console.log(model)
    const params = {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            nodeDataArray: model.nodeDataArray,
            linkDataArray: model.linkDataArray,
            name: document.getElementById("saveName").value
        })
    };
    const res = await fetch(url, params);
    res.json().then(msg => console.log(msg))
}