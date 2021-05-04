/*
* Copyright (c) 2021 Ecore. All rights reserved.
*
* University:		 Frankfurt University of Applied Sciences
* Study program:	 Engineering Business Information Systems
* Module:		   Advanced Programming 2021
* Professor:		   Prof. Dr. Jung, Prof. Dr. Bremm
* Date:			     21.04.2021
*
*/

/**
* A short description what this file/class is all about.
* @author Leonard Hußke , Feng Yi Lu
* this file contains several functions that are needed to display and interact with the Diagram Canvas in the HTML File ()
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


/**this function adds a new node to our nodeDataArray */
function addNode(name, category, desc) {
    if (model.nodeDataArray.length === 0) {
        id = 0;
    } else {
        id = model.nodeDataArray[model.nodeDataArray.length - 1].key;
    }
    diagram.startTransaction("make new node");
    model.addNodeData({
        key: id + 1,
        nameProperty: name,
        category: category,
        desc: desc
    });
    diagram.commitTransaction("update");


}
/**
 * this function gets the input values from the user and calls the addNode() function
 */
function readNodeProperties() {
    var name = document.getElementById("name").value;
    var category = document.getElementById("category").value;
    var desc = document.getElementById("desc").value;
    if (checkNodeName(name) === true) {
        window.alert("node name already exists");
    } else {
        addNode(name, category, desc);
    }

}

/**
 * this function checks if the given name for the new node is already existing or not
 */
function checkNodeName(name) {
    for (i = 0; i < model.nodeDataArray.length; i++) {
        if (name === model.nodeDataArray[i].nameProperty) {
            return true;
        }
    }
    return false;
}

