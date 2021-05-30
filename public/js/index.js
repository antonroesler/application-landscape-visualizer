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

function showMessage(s) {
    document.getElementById("diagramEventsMsg").textContent = s;
  }

diagram.addDiagramListener("ObjectSingleClicked",
    function(e) {
        let part = e.subject.part;
        let str = "ID: " + part.data.key + "\nName: " + part.data.nameProperty + "\nCategory: "
            + part.data.category + "\nDescription: " + part.data.desc + "\nTags: "
            + part.data.tags + "\nVersion: " + part.data.version + "\nDepartment: "
            + part.data.departments + "\nAllowed Users: " + "\nLicense: " + part.data.license
            + "\nLocation: " + part.data.loc + "\nStart Date: " + part.data.startDate
            + "\nShutdown Date: " + part.data.shutdownDate + "\nProf. Owner: " + part.data.profOwner
            + "\nTech. Owner: " + part.data.techOwner;
        if (!(part instanceof go.Link)) showMessage(str);
    });

const model = $(go.GraphLinksModel);


model.linkFromPortIdProperty= "fromPort";  // required information:
model.linkToPortIdProperty= "toPort";

model.nodeDataArray = [];
model.linkDataArray = [];

let modelNodeWithoutFilter = [];
let modelLinkWithoutFilter = [];

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
    placeholder: "Department",
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
