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

/**
 * init function to create the model.
 */
function init() {
    diagram.model = model;
    // passing our Template Maps into our diagram
    diagram.nodeTemplate = mainTemplate;
    diagram.linkTemplateMap = linkTemplateMap;
    diagram.layout = $(go.LayeredDigraphLayout);
}

/**
 * Saves a AppNode in the database and adds it to the canvas.
 *
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
 * Loads all existing AppNodes from the Database and adds them to the diagram.
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