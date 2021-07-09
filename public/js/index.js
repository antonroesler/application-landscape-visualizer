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
 * Index JS defines global JS variables, especially the gojs model
 * @author Leonard Hußke , Feng Yi Lu, Anton Roesler, Benedikt Möller
 */

//const URL = 'http://localhost:8000'

const $ = go.GraphObject.make;

const diagram = $(go.Diagram, "diagramDiv",
    { // enable Ctrl-Z to undo and Ctrl-Y to redo
        "undoManager.isEnabled": true,
        "toolManager.hoverDelay": 100,
        "scrollMode": go.Diagram.InfiniteScroll
    });

const model = $(go.GraphLinksModel);

model.linkFromPortIdProperty = "fromPort";  // required information:
model.linkToPortIdProperty = "toPort";

model.nodeDataArray = [];
model.linkDataArray = [];
let modelNodeWithoutFilter = [];
let modelLinkWithoutFilter = [];
let parentChildNodeSet = new Set();
let parentChildLinkArray = [];
let diagramNodeParentChildBeforeFilterIsActive = new Set();
let diagramLinkParentChildBeforeFilterIsActive = [];
var parentChildFeatureOn = false;
const nodeWidth = 80;
const initialLayout = diagram.layout;

let doTooltip = null;


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

const linkSelectableAttributes = new Map([
    ["type", "Connection Type"],
    ["from", "From"],
    ["to", "To"]
]);

const selectableKeyFigures = new Map([
    ["totalNumberOfNodes", "Number of Applications"],
    ["totalNumberOfLinks", "Number of Connections"],
    ["avgNumberOfChildren", "Average Number of Children"],
    ["avgNumberOfParents", "Average Number of Parents"],
    ["avgNumberOfInputsOutputs", "Average number of Inputs"],
    ["numberOfSeparateGraphs", "Number of separate Graphs"]
]);

const defaultSettings = {
    "checkboxDiagramHover" : true,
    "checkboxTutorial" : true,
    "checkboxInfinityScroll" : true
};



