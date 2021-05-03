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
* @author Feng Yi Lu
*this file contains all templates that will be used for different Nodes
*- templates are used for various Nodes, its a configuration for a certain type
   of Node e.g. Database
*- usage: in this file we create a variable that contains a preset of a Node-style
*-        these variables can be used in the index.js file. 
*-        "templmap" is a Map that contains all of our templates that we create, with 
          the function add("category-name", template-variable) we can add more templates to it. 
*-        In Index.js we declare a TemplateMap to our diagram "diagram.nodeTemplateMap = templmap;"
          with that our nodes are able to use these templates 
         (the attribute "category" inside of the Node Object declares which template it uses)
*        
*/

var databaseTemplate =
    // "vertical" determine the order of the go.objects 
    $(go.Node, "Vertical",
        //per default color and size is setted, can be customised through e.g. "go.Binding()"
        $(go.Shape, "Database", { height: 70, width: 70, fill: "blue" },
            new go.Binding("fill", "color")),
        $(go.TextBlock, { font: "bold 12pt sans-serif" },
            new go.Binding("text", "key")),
        $(go.TextBlock, "Description:"),
        $(go.TextBlock, new go.Binding("text", "desc")),
    );
/**
* databaseTemplate
* is used for generating a "database" node
*/

var componentTemplate =
    $(go.Node, "Vertical",
        $(go.Shape, "Component", { height: 70, width: 70, fill: "red" },
            new go.Binding("fill", "color")),

        $(go.TextBlock, { font: "bold 12pt sans-serif" },
            new go.Binding("text", "key")),
        $(go.TextBlock, "Description:"),
        $(go.TextBlock, new go.Binding("text", "desc")),
    );
/**
* componentTemplate
* is used for generating a "component (part of an Application-node)" node 
*/

var packageTemplate =
    $(go.Node, "Vertical",
        $(go.Shape, "Package", { height: 70, width: 70, fill: "green" },
            new go.Binding("fill", "color")),

        $(go.TextBlock, { font: "bold 12pt sans-serif" },
            new go.Binding("text", "key")),
        $(go.TextBlock, "Description:"),
        $(go.TextBlock, new go.Binding("text", "desc")),
    );
/**
* packageTemplate
* is used for generating a "Application" node 
*/


/**templmap includes all of our templates, we can get access to with "category" inside of an NodeObject. 
Name of the template is defined in templmap.add("name", variable of Template)*/
var templmap = new go.Map();
templmap.add("", diagram.nodeTemplate);
templmap.add("Database", databaseTemplate);
templmap.add("Component", componentTemplate)
templmap.add("Package", packageTemplate);