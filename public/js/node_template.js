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
* function is needed to use the icons in icons.js
*/
function geoFunc(geoname) {
    var geo = icons[geoname];
    if (typeof geo === "string") {
        geo = icons[geoname] = go.Geometry.parse(geo, true);  // fill each geometry
    }
    return geo;
}

/**
* Template
* is used for generating a node and also showing Metadata and key of the node while hovering
*/
var mainTemplate =
    $(go.Node, "Vertical",
        $(go.Shape,
            { background: "transparent", fill: "black", strokeWidth: 0, width: 65, height: 70 },
            new go.Binding("geometry", "category", geoFunc), new go.Binding("background", "color")), $(go.TextBlock, { font: "bold 12pt sans-serif" },
                new go.Binding("text", "nameProperty")), new go.Binding("text", "tags"), new go.Binding("text", "tags"), new go.Binding("text", "version"),
        new go.Binding("text", "department"),
        new go.Binding("text", "allowedUsers"), new go.Binding("text", "license"),
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
    });
