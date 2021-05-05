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

const $ = go.GraphObject.make;
const diagram = $(go.Diagram, "diagramDiv",
    { // enable Ctrl-Z to undo and Ctrl-Y to redo
        "undoManager.isEnabled": true,
        "toolManager.hoverDelay": 100
    });
const model = $(go.GraphLinksModel);
model.nodeDataArray = [];

model.linkDataArray = [];


function init() {

    diagram.model = model;
    // passing our TemplateMap into our diagram
    diagram.nodeTemplateMap = templmap;

    diagram.layout = $(go.LayeredDigraphLayout);

}

/**
 * Saves a AppNode in the database and adds it to the canvas.
 *
 */
async function addAppNode() {
    const data = readNodeProperties();
    if (data !== undefined){
        const url = urljoin(window.location.href, 'mongo/node');
        const params = {
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body:JSON.stringify(data),
        };
        const res = await fetch(url, params);
        res.json().then(appNode => {
            console.log(appNode)
            addNode(appNode.name, appNode.category, appNode.desc, appNode._id)
        })

    }
}

/**
 * Adds a new node to our nodeDataArray.
 */
function addNode(name, category, desc, id) {
    diagram.startTransaction("make new node");
    model.addNodeData({
        key: id,
        nameProperty: name,
        category: category,
        desc: desc
    });
    diagram.commitTransaction("update");


}
/**
 * Gets the input values from the user and calls the addNode() function to add
 * node to diagram.
 */
function readNodeProperties() {
    var name = document.getElementById("name").value;
    var category = document.getElementById("category").value;
    var desc = document.getElementById("desc").value;
    if (checkNodeName(name) === true) {
        window.alert("node name already exists");
        return undefined
    }
    return {name:name, category:category, desc:desc}

}

/**
 * Loads all existing AppNodes from the Database and adds them to the diagram.
 *
 */
async function loadAllAppNodes() {
    const url = urljoin(window.location.href, 'mongo/node');
    const params = {
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    };
    const res = await fetch(url, params);
    res.json().then(appNodes => {
        appNodes.forEach(appNode => {
            addNode(appNode.name, appNode.category, appNode.desc, appNode._id)
        })

    })
}

/**
 * Checks if the given name for the new node is already existing or not
 */
function checkNodeName(name) {
    for (i = 0; i < model.nodeDataArray.length; i++) {
        if (name === model.nodeDataArray[i].nameProperty) {
            return true;
        }
    }
    return false;
}


async function apiTest() {
    const url = urljoin(window.location.href, 'mongo/node');
    const data = {
        name: "Feng",
        category: "Application"
    };
    const params = {
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        mode: "same-origin",
        body:JSON.stringify(data),
    };
    const res = await fetch(url, params);
    console.log(res.json())



}
