/*
* Copyright (c) 2021 Ecore. All rights reserved.
*
* University:        Frankfurt University of Applied Sciences
* Study program:     Engineering Business Information Systems
* Module:            Advanced Programming 2021
* Professor:         Prof. Dr. Jung, Prof. Dr. Bremm
* Date:              21.04.2021
*
*
*/

/**
* This file contains all templates that will be used for different styles of
* AppNodes. In this file we create a variable that contains a preset of a node
* style these variables can be used in the index.js file. 
* 'templmap' is a map that contains all of our templates that we create.
* In Index.js we declare a TemplateMap to our diagram 
* "diagram.nodeTemplateMap = templmap;" with that our nodes are able to use 
* these templates.
* (the attribute "category" inside of the AppNode object declares which template it uses)
*
* @author Feng Yi Lu
*        
*/


/**
* databaseTemplate
* is used for generating a "database" node and also showing Metadata and key of the node while hovering
*/
var databaseTemplate =
    // "vertical" determine the order of the go.objects 
    $(go.Node, "Vertical",
        new go.Binding("location", "loc"),
        //per default color and size is setted, can be customised through e.g. "go.Binding()" 
        $(go.Shape, "Database", { height: 70, width: 70, fill: "blue" },
            new go.Binding("fill", "color")),
        $(go.TextBlock, { font: "bold 12pt sans-serif" },
            new go.Binding("text", "nameProperty")),
        {
            //toolTip is used for the hover function 
            toolTip:
                $(go.Adornment, "Auto",
                    $(go.Shape, { fill: "white" }), $(go.Panel, "Vertical",
                        $(go.TextBlock, "Description:"),
                        $(go.TextBlock,
                            new go.Binding("text", "desc")), $(go.TextBlock, "key_id:"),
                        $(go.TextBlock,
                            new go.Binding("text", "key"))
                    ))
        }, {
        contextMenu:     // define a context menu for each node
            $("ContextMenu",  
                $("ContextMenuButton",
                    {
                        "ButtonBorder.fill": "white",
                        "_buttonFillOver": "skyblue"
                    },
                    $(go.TextBlock, "delete"),
                    { click: deleteNodeFromNodeDataArray })
                // more ContextMenuButtons would go here
            )  
    }
    );
/**
* componentTemplate
* is used for generating a "component" node and also showing Metadata and key of the node while hovering
*/
var componentTemplate =
    $(go.Node, "Vertical",
        $(go.Shape, "Component", { height: 70, width: 70, fill: "red" },
            new go.Binding("fill", "color")),

        $(go.TextBlock, { font: "bold 12pt sans-serif" },
            new go.Binding("text", "nameProperty")),
        {
            toolTip:
                $(go.Adornment, "Auto",
                    $(go.Shape, { fill: "white" }), $(go.Panel, "Vertical",
                        $(go.TextBlock, "Description:"),
                        $(go.TextBlock,
                            new go.Binding("text", "desc")), $(go.TextBlock, "key_id:"),
                        $(go.TextBlock,
                            new go.Binding("text", "key"))
                    ))
        }, {
            contextMenu:     // define a context menu for each node
                $("ContextMenu",  
                    $("ContextMenuButton",
                        {
                            "ButtonBorder.fill": "white",
                            "_buttonFillOver": "skyblue"
                        },
                        $(go.TextBlock, "delete"),
                        { click: deleteNodeFromNodeDataArray })
                    // more ContextMenuButtons would go here
                )  
    }
    );

/**
* packageTemplate
* is used for generating a "application" node and also showing Metadata and key of the node while hovering
*/
var packageTemplate =
    $(go.Node, "Vertical", $(go.Shape, "Package", {
        height: 70, width: 70, fill: "green"
    }, new go.Binding("fill", "color")),
        $(go.TextBlock, { font: "bold 12pt sans-serif" },
            new go.Binding("text", "nameProperty")),
        {
            toolTip:
                $(go.Adornment, "Auto",
                    $(go.Shape, { fill: "white" }), $(go.Panel, "Vertical",
                        $(go.TextBlock, "Description:"),
                        $(go.TextBlock,
                            new go.Binding("text", "desc")), $(go.TextBlock, "key_id:"),
                        $(go.TextBlock,
                            new go.Binding("text", "key"))
                    ))
        }, {
        contextMenu:     // define a context menu for each node
            $("ContextMenu",  // that has one button
                $("ContextMenuButton",
                    {
                        "ButtonBorder.fill": "white",
                        "_buttonFillOver": "skyblue"
                    },
                    $(go.TextBlock, "delete"),
                    { click: deleteNodeFromNodeDataArray })
                // more ContextMenuButtons would go here
            )  
    }
    );


/**
* templmap includes all templates, we can get access to with "category" inside
* of an node object. 
*/
var nodeTemplateMap = new go.Map();
nodeTemplateMap.add("", diagram.nodeTemplate);
nodeTemplateMap.add("Database", databaseTemplate);
nodeTemplateMap.add("Component", componentTemplate)
nodeTemplateMap.add("Package", packageTemplate);

