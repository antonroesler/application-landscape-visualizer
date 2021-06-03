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

const nodeSelectableAttributes = new Map([
    ["name", "Name"],
    ["desc", "Description"],
    ["license", "License"],
    ["version", "Version"],
    ["departments", "Departments"],
    ["tags", "Tags"],
    ["startDate", "Start Date"],
    ["shutdownDate", "Shutdown Date"],
    ["profOwner", "Professional Owner"],
    ["techOwner", "Technical Owner"],
    ["category", "Application Type"]
]);


/**
 * Initialise chips for the createNodeModal.
 */
const departmentChips = document.querySelectorAll("#inputDepartments");
M.Chips.init(departmentChips, {
    placeholder: "Department",
    secondaryPlaceholder: "+tag",
});

const tagChips = document.querySelectorAll("#inputTags");
M.Chips.init(tagChips, {
    placeholder: "Your tag",
    secondaryPlaceholder: "+tag",
});

/**
 * Initialize Tabs
 */
document.addEventListener("DOMContentLoaded", function() {
    const myTabs = document.querySelector(".tabs");
    M.Tabs.init(myTabs, {
        swipeable: true
    });
});

/**
 * Initialize left slide menu
 */
let sidenav;

document.addEventListener('DOMContentLoaded', function() {
    let elem = document.querySelector('.sidenav');
    M.Sidenav.init(elem, {
        draggable: true
    });
    sidenav = M.Sidenav.getInstance(elem);
});

function openSidenav() {
    if(!sidenav.isOpen) {
        generateCollapsible();
        sidenav.open();
    }
    else {
        document.getElementById("sidenavForm").reset();
        sidenav.close();
    }
}

/**
 * Initialize collapsible
 */
document.addEventListener('DOMContentLoaded', function() {
    let elems = document.querySelectorAll('.collapsible');
    M.Collapsible.init(elems, {
        accordion: false
    });
});