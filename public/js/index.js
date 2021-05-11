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

//need this variable to be able to add nodes in different ways (used in addNode()) !! if possible better solution
var addNodeManager = "default";

/* this menu pops up with right click into the diagram Canvas (undo, redo, add) Option*/
diagram.contextMenu =
    $("ContextMenu",
        $("ContextMenuButton",
            $(go.TextBlock, "Undo"),
            { click: function (e, obj) { e.diagram.commandHandler.undo(); } },
            new go.Binding("visible", "", function (o) {
                return o.diagram.commandHandler.canUndo();
            }).ofObject()),
        $("ContextMenuButton",
            $(go.TextBlock, "Redo"),
            { click: function (e, obj) { e.diagram.commandHandler.redo(); } },
            new go.Binding("visible", "", function (o) {
                return o.diagram.commandHandler.canRedo();
            }).ofObject()),
        $("ContextMenuButton",
            $(go.TextBlock, "New Node"),
            {
                click: function (e, obj) {
                    e.diagram.commit(function (d) {
                        var openModal = document.getElementById("create-modal-btn");
                        addNodeManager = "DiagramCanvasContextMenu";
                        openModal.click();
                    });
                }
            }
        ));

/**
 * init function to create the model.
 */
function init() {
    diagram.model = model;
    // passing our Template Maps into our diagram
    diagram.nodeTemplateMap = nodeTemplateMap;
    diagram.linkTemplateMap = linkTemplateMap;
    diagram.layout = new go.ForceDirectedLayout();
}

/**
 * changes var addNodeManager so that addNode() knows that it should create a link.
 */
function addNodeAndLink() {
    var openModal = document.getElementById("create-modal-btn");
    addNodeManager = "NodeContextMenuAdd";
    openModal.click();
}

/**
 * Saves a AppNode in the database and adds it to the canvas.
 *
 */
async function addAppNode() {
    const data = readNodeProperties();
    const newNodeLocation = getDesiredLocation();
    let newNode;
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
            const appNode = await res.json();
                if (Object.keys(appNode).length !== 0) {
                    // If AppNode was stored successfully in Database use data returned from mongo to create AppNode
                    newNode = addNodeToDiagram(appNode.name, appNode.category, appNode.desc, appNode._id, newNodeLocation)
                } else {
                    // Inform user that database is unavailable
                    databaseNotAvailableAlert();
                    // Create AppNode with id being the current time in milliseconds
                    newNode = addNodeToDiagram(data.name, data.category, data.desc, Date.now(),newNodeLocation);
                }
        }
    } else {
        newNode = addNodeToDiagram(data.name, data.category, data.desc, Date.now(),newNodeLocation);
    }
    await handleContextMenuOptions(newNode);
}

/**
 * Handles options that were specified via the context menu for a new created AppNode.
 * @param newNode
 */
async function handleContextMenuOptions(newNode){
    if (addNodeManager === "NodeContextMenuAdd") {
        const newLink = { from: diagram.selection.toArray()[0].key, to: newNode.key };
        const link = await addLinkToDatabase(newLink);
        addLinkToDiagram(link._id, link.from, link.to)
    }
    addNodeManager = "default";
}

/**
 * Adds a new node to our nodeDataArray.
 */
function addNodeToDiagram(name, category, desc, id, pos) {
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
 * Adds a link to the diagram.
 */
function addLinkToDiagram(id, from, to){
    diagram.startTransaction("make new link");
    const newLink = {
        key: id,
        from: from,
        to: to
    };
    model.addLinkData(newLink);
    diagram.commitTransaction("update");
}

/**
 * Adds a Link-Object to the database and returns the object as it is stored in the DB, including the _id Attribute.
 * @param link
 */
async function addLinkToDatabase(link){
    if (link !== undefined) {
        const url = urljoin(URL, 'mongo/link');
        const params = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(link),
        };
        const res = await fetch(url, params);
        return await res.json();
    }
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
 */
async function loadAllAppNodesAndLinks() {
    const urlNodes = urljoin(URL, 'mongo/node');
    const urlLinks = urljoin(URL, 'mongo/link');
    const params = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    };
    // Add AppNodes to diagram
    const resNodes = await fetch(urlNodes, params);
    const appNodes = await resNodes.json()
    appNodes.forEach(appNode => {
        if (appNodeIdExists(appNode._id) !== true) {
            addNodeToDiagram(appNode.name, appNode.category, appNode.desc, appNode._id)
        }
    })
    //Add Links to diagram
    const resLinks = await fetch(urlLinks, params);
    const links = await resLinks.json()
    links.forEach(link => {
        if (linkIdExists(link._id) !== true) {
            addLinkToDiagram(link._id, link.from, link.to)
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
 * Checks if a link with a given id exists in the models linkDataArray.
 * @param id
 * @returns {boolean}
 */
function linkIdExists(id){
    for (let i = 0; i < model.linkDataArray.length; i++) {
        if (model.linkDataArray[i].key === id) {
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
 * Returns the desired point to locate a new AppNode app. It is either the center of the diagram or the click point from
 * the context menu, if a new node was created using the context menu (right click).
 *
 * @returns location
 */
function getDesiredLocation(){
    if (addNodeManager === "DiagramCanvasContextMenu") {
        addNodeManager = "default";
        return diagram.toolManager.contextMenuTool.mouseDownPoint;
    }
    else {
        return diagram.documentBounds.center;
    }
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
