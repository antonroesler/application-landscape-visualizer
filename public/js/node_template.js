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
                    { click: deleteNode })
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
                        { click: deleteNode })
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
                    { click: deleteNode })
                // more ContextMenuButtons would go here
            )  
    },
    $(go.Panel, "Table",
        $(go.RowColumnDefinition,
            { column: 0, alignment: go.Spot.Left }),
        $(go.RowColumnDefinition,
            { column: 2, alignment: go.Spot.Right }),
        $(go.TextBlock,  // the node title
            {
                column: 0, row: 0, columnSpan: 3, alignment: go.Spot.Center,
                font: "bold 10pt sans-serif", margin: new go.Margin(4, 2)
            },
            new go.Binding("text", "key")),
        $(go.Panel, "Horizontal",
            { column: 0, row: 1 },
            $(go.Shape,  // the "A" port
                {
                    width: 6, height: 6, portId: "A", toSpot: go.Spot.Left,
                    toLinkable: true, toMaxLinks: 1,
                    toLinkableDuplicates: true
                }),  // allow user-drawn links from here
                $(go.TextBlock, "A")  // "A" port label
                ),
                $(go.Panel, "Horizontal",
                { column: 0, row: 2 },
                $(go.Shape,  // the "B" port
                {
                    width: 6, height: 6, portId: "B", toSpot: go.Spot.Left,
                    toLinkable: true, toMaxLinks: 1,
                    toLinkableDuplicates: true
                }),  // allow user-drawn links from here
                $(go.TextBlock, "B")  // "B" port label
                ),
                $(go.Panel, "Horizontal",
                { column: 2, row: 1, rowSpan: 2 },
                $(go.TextBlock, "Out"),  // "Out" port label
                $(go.Shape,  // the "Out" port
                {
                    width: 6, height: 6, portId: "Out", fromSpot: go.Spot.Right,
                    fromLinkable: true,
                    toLinkableDuplicates: true,
                    fromLinkableDuplicates: true
                })  // allow user-drawn links to here
        )
    )

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

