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

const pathURL = 'http://localhost:8000'
const $ = go.GraphObject.make;
const diagram = $(go.Diagram, "diagramDiv",
    { // enable Ctrl-Z to undo and Ctrl-Y to redo
        "undoManager.isEnabled": true,
        "toolManager.hoverDelay": 100
    });
const model = $(go.GraphLinksModel);
model.nodeDataArray = [];

model.linkDataArray = [];

/**
 * init function to create the model.
 */
function init() {
    diagram.model = model;
    // passing our Template Maps into our diagram
    diagram.nodeTemplateMap = nodeTemplateMap;
    diagram.linkTemplateMap = linkTemplateMap;

    diagram.contextMenu = contextMenu;

    diagram.layout = $(go.LayeredDigraphLayout);
}

/**
 * Saves a AppNode in the database and adds it to the canvas.
 *
 */
async function addAppNode() {
    const data = readNodePropertiesFromModal();

    const newNodeLocation = getDesiredLocation();
    console.log(newNodeLocation);

    let newNode;
    if (useDatabaseSwitchIsOn()) {
        if (data !== undefined) {
            const url = urljoin(pathURL, 'mongo/node');
            const params = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            };
            const res = await fetch(url, params);
            const appNode = await res.json();
            if (Object.keys(appNode).length !== 0) {
                // If AppNode was stored successfully in Database use data returned from mongo to create AppNode
                newNode = addNodeToNodeDataArray(appNode.name, appNode.category, appNode.desc, appNode._id, newNodeLocation)
            } else {
                // Inform user that database is unavailable
                databaseNotAvailableAlert();
                // Create AppNode with id being the current time in milliseconds
                newNode = addNodeToNodeDataArray(data.name, data.category, data.desc, Date.now(), newNodeLocation);
            }
        }
    } else {
        newNode = addNodeToNodeDataArray(data.name, data.category, data.desc, Date.now(), newNodeLocation);
    }
    console.log(model.nodeDataArray);
}

/**
 * Adds a new node to our nodeDataArray.
 */
function addNodeToNodeDataArray(name, category, desc, id, pos) {
    diagram.startTransaction("make new node");
    console.log(pos)
    const newNode = {
        key: id,
        nameProperty: name,
        category: category,
        desc: desc,
    };
    model.addNodeData(newNode);
    const part = diagram.findPartForData(newNode);
    part.location = pos;
    diagram.commitTransaction("update");
    return newNode;
}

/**
 * Delete selected node from nodeDataArray.
 */
function deleteNodeFromNodeDataArray() {
    var id = diagram.selection.toArray()[0].key;
    var node = diagram.findNodeForKey(id);
    diagram.startTransaction();
    diagram.remove(node);
    diagram.commitTransaction("deleted node");
    deleteAppNodeFromDB(id);
}

/**
 * Gets the input values from the modal and returns a json object
 */
function readNodePropertiesFromModal() {
    var name = document.getElementById("name").value;
    if (name === "") {
        window.alert("Please enter a name for the node");
    } else {
        var category = document.getElementById("category").value;
        var desc = document.getElementById("desc").value;
        if (appNodeNameExists(name) === true) {
            window.alert("node name already exists");
            return undefined
        }
        return { name: name, category: category, desc: desc }
    }
}

/**
 * Loads all existing AppNodes from the Database and adds them to the diagram.
 *
 */
async function loadAllAppNodes() {
    const url = urljoin(pathURL, 'mongo/node');
    const params = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    };
    const res = await fetch(url, params);
    const appNodes = await res.json()
    appNodes.forEach(appNode => {
        if (appNodeIdExists(appNode._id) !== true) {
            addNodeToNodeDataArray(appNode.name, appNode.category, appNode.desc, appNode._id)
            }
        })
}

/**
 * Delete selected node from database.
 */
async function deleteAppNodeFromDB(id) {
    const url = urljoin(pathURL, 'mongo/node/' , id);
    const params = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    };
    const res = await fetch(url, params);
    res.json().then(appNode => {alert(appNode.name + "was deleted")})
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
 * Checks if an appNode with a given id exists in the models nodeDataArray.
 * @param id
 * @returns {boolean}
 */
function appNodeIdExists(id) {
    for (let i = 0; i < model.nodeDataArray.length; i++) {
        if (model.nodeDataArray[i].key === id) {
            return true;
        }
    }
    return false;
}

/**
 * Returns the value (true/false) of the use Database switch. If true, changes should be send to the DB right away. If
 * false, changes are only in the browser.
 * @returns boolean
 */
function useDatabaseSwitchIsOn() {
    return document.getElementById("db-toggle").checked
}

function databaseNotAvailableAlert() {
    alert("Database ist not available. Please contact admin to get database access. \n YOUR WORK IS NOT SAVED.")
}

/**
 * Returns the desired point to locate a new AppNode app. It is either the center of the diagram or the click point from
 * the context menu, if a new node was created using the context menu (right click).
 *
 * @returns location
 */
function getDesiredLocation(){
    /*if (diagram.toolManager.contextMenuTool.canStart()) { */
        return diagram.toolManager.contextMenuTool.mouseDownPoint;
   /* }
    else {
        return diagram.documentBounds.center;
    } */
}