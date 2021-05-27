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
 * @author Leonard Hußke , Feng Yi Lu, Anton Roesler
 */

const URL = 'http://localhost:8000'

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

const diagramNames = [];
let modelWithoutFilter = [];
let allFilter = [];

const initialLayout = diagram.layout;

/**
 * Initialise chips for the createNodeModal.
 */
const departmentChips = document.querySelectorAll("#inputDepartments");
M.Chips.init(departmentChips, {
    autocompleteOptions: {
        data: {
            'Youtube':null, // Dummy data
            'Google':null // Dummy data
        },
        limit: Infinity,
        minlength: 1
    },
    placeholder: "Your tag",
    secondaryPlaceholder: "+department",
});

const tagChips = document.querySelectorAll("#inputTags");
M.Chips.init(tagChips, {
    autocompleteOptions: {
        data: {
            'Youtube':null, // Dummy data
            'Google':null // Dummy data
        },
        limit: Infinity,
        minlength: 1
    },
    placeholder: "Your tag",
    secondaryPlaceholder: "+tag",
});



