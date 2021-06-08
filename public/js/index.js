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
 * Index JS defines global variables and adds properties to these variables.
 * @author Leonard Hußke , Feng Yi Lu, Anton Roesler
 */

//const URL = 'http://localhost:8000'

const $ = go.GraphObject.make;

const diagram = $(go.Diagram, "diagramDiv",
    { // enable Ctrl-Z to undo and Ctrl-Y to redo
        "undoManager.isEnabled": true,
        "toolManager.hoverDelay": 100
    });

const model = $(go.GraphLinksModel);

model.linkFromPortIdProperty= "fromPort";  // required information:
model.linkToPortIdProperty= "toPort";

model.nodeDataArray = [];
model.linkDataArray = [];

let modelNodeWithoutFilter = [];
let modelLinkWithoutFilter = [];

const nodeWidth = 80;
const initialLayout = diagram.layout;


/**
 * The keys of the nodeSelectableAttributes map are the attributes of a node which are allowed to be seen in the UI.
 * The values of the nodeSelectableAttributes contain the node attributes which can be shown in the UI and which are in
 * the right string format.
 *
 * @type {Map<string, string>}
 */
const nodeSelectableAttributes = new Map([
    ["name", "Name"],
    ["desc", "Description"],
    ["license", "License"],
    ["version", "Version"],
    ["departments", "Departments"],
    ["tags", "Tags"],
    ["startDate", "Start-Date"],
    ["shutdownDate", "Shutdown-Date"],
    ["profOwner", "Professional Owner"],
    ["techOwner", "Technical Owner"],
    ["category", "Application Type"]
]);

