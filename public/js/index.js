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

/**
 * init function to create the model.
 */
function init() {
    diagram.model = model;
    // passing our Template Maps into our diagram
    diagram.nodeTemplate = mainTemplate;
    diagram.linkTemplateMap = linkTemplateMap;
}

/**
 * Saves a AppNode in the database and adds it to the canvas.
 *
 */
async function addAppNode() {
    const data = readNodeProperties();
    if (useDatabaseSwitchIsOn()) {
        if (data !== undefined) {
            const url = urljoin(URL, 'mongo/node');
            const params = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            };
            const res = await fetch(url, params);
            res.json().then(appNode => {
                if (Object.keys(appNode).length !== 0) {
                    // If AppNode was stored successfully in Database use data returned from mongo to create AppNode
                    addNode(appNode.name, appNode.category, appNode.desc, appNode._id)
                } else {
                    // Inform user that database is unavailable
                    databaseNotAvailableAlert();
                    // Create AppNode with id being the current time in milliseconds
                    addNode(data.name, data.category, data.desc, Date.now());
                }

            })

        }
    } else {
        addNode(data.name, data.category, data.desc, Date.now());
    }
}

/**
 * Adds a new node to our nodeDataArray.
 */
function addNode(name, category, desc, id) {
    diagram.startTransaction("make new node");
    //if (category ==="Application"){var color = "blue"}
    //custom color setting for user
    model.addNodeData({
        key: id,
        nameProperty: name,
        category: category,
        desc: desc
        //color: color
    });
    diagram.commitTransaction("update");

}
/**
 * Delete selected node from nodeDataArray.
 */
function deleteNode() {
    var id = diagram.selection.toArray()[0].key;
    var node = diagram.findNodeForKey(id);
    diagram.startTransaction();
    diagram.remove(node);
    diagram.commitTransaction("deleted node");
    deleteAppNode(id);
}

/**
 * Gets the input values from the user and calls the addNode() function to add
 * node to diagram.
 */
function readNodeProperties() {
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
    const url = urljoin(URL, 'mongo/node');
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
            addNode(appNode.name, appNode.category, appNode.desc, appNode._id)
        }
    })
}

/**
 * Delete selected node from database.
 */
async function deleteAppNode(id) {
    const url = urljoin(URL, 'mongo/node/', id);
    const params = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    };
    const res = await fetch(url, params);
    res.json().then(appNode => { alert(appNode.name + "was deleted") })
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
