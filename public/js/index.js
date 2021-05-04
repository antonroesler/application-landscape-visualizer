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
* this file contains the init() function that is needed to display the Diagram Canvas in the HTML File 
*/

const $ = go.GraphObject.make;
const diagram = $(go.Diagram, "diagramDiv",
    { // enable Ctrl-Z to undo and Ctrl-Y to redo
        "undoManager.isEnabled": true
    });
const model = $(go.GraphLinksModel);
model.nodeDataArray = [{ key: "Component", category: "Component", desc: "metadata" }, { key: "Neo4J", color: "white", category: "Database", desc: "metadata" }, { key: "Application", category: "Package", desc: "metadata" }];
model.linkDataArray = [];


function init() {

    diagram.model = model;
    // passing our TemplateMap into our diagram
    diagram.nodeTemplateMap = templmap;

    diagram.layout = $(go.LayeredDigraphLayout);

}

