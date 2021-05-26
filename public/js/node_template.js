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
        geo = icons[geoname] = go.Geometry.parse(geo, true); // fill each geometry
    }
    return geo;
}

function makePort(name, align, spot, output, input) {
    var horizontal = align.equals(go.Spot.Top) || align.equals(go.Spot.Bottom);
    // the port is basically just a transparent rectangle that stretches along the side of the node,
    // and becomes colored when the mouse passes over it
    return $(go.Shape, {
        fill: "transparent", // changed to a color in the mouseEnter event handler
        strokeWidth: 0, // no stroke
        width: horizontal ? NaN : 8, // if not stretching horizontally, just 8 wide
        height: !horizontal ? NaN : 8, // if not stretching vertically, just 8 tall
        alignment: align, // align the port on the main Shape
        stretch: horizontal ? go.GraphObject.Horizontal : go.GraphObject.Vertical,
        portId: name, // declare this object to be a "port"
        fromSpot: spot, // declare where links may connect at this port
        fromLinkable: output, // declare whether the user may draw links from here
        toSpot: spot, // declare where links may connect at this port
        toLinkable: input, // declare whether the user may draw links to here
        cursor: "pointer", // show a different cursor to indicate potential link point
        mouseEnter: function (e, port) {
            // the PORT argument will be this Shape
            if (!e.diagram.isReadOnly) port.fill = "rgba(255,0,255,0.5)";
        },
        mouseLeave: function (e, port) {
            port.fill = "transparent";
        },
    });
}

/**
 * Template
 * is used for generating a node and also showing Metadata and key of the node while hovering
 */
var mainTemplate = $(
    go.Node,
    "Vertical",
    new go.Binding("location", "loc",go.Point.parse).makeTwoWay(go.Point.stringify),
    $(
        go.Panel,
        "Auto",
        $(
            go.Shape,
            {
                background: "transparent",
                fill: "black",
                strokeWidth: 0,
                width: 65,
                height: 70,
            },
            new go.Binding("geometry", "category", geoFunc),
            new go.Binding("background", "color"),
        ),
        // four named ports, one on each side:
        makePort("T", go.Spot.Top, go.Spot.TopSide, true, true),
        makePort("L", go.Spot.Left, go.Spot.LeftSide, true, true),
        makePort("R", go.Spot.Right, go.Spot.RightSide, true, true),

    ),

    $(
        go.TextBlock,
        {
            font: "bold 12pt sans-serif",
        },
        new go.Binding("text", "nameProperty")
    ),
    makePort("B", go.Spot.Bottom, go.Spot.BottomSide, true, true),
    new go.Binding("text", "tags"),
    new go.Binding("text", "version"),
    new go.Binding("text", "department"),
    new go.Binding("text", "allowedUsers"),
    new go.Binding("text", "license"),
    {
        toolTip:
            $("ToolTip",
                $(go.Panel, "Table",
                    { defaultAlignment: go.Spot.Left },
                    $(go.TextBlock, "ID: ", { row: 0, column: 0, margin: 5 }),
                    $(go.TextBlock, new go.Binding("text", "key"),
                        { row: 0, column: 1, margin: 5 }),
                    $(go.TextBlock, "Name: ", { row: 1, column: 0, margin: 5 }),
                    $(go.TextBlock, new go.Binding("text", "nameProperty"),
                        { row: 1, column: 1, margin: 5 }),
                    $(go.TextBlock, "Category: ", { row: 2, column: 0, margin: 5 }),
                    $(go.TextBlock, new go.Binding("text", "category"),
                        { row: 2, column: 1, margin: 5 }),
                    $(go.TextBlock, "Description: ", { row: 3, column: 0, margin: 5 }),
                    $(go.TextBlock, new go.Binding("text", "desc"),
                        { row: 3, column: 1, margin: 5 }),
                    $(go.TextBlock, "Tags: ", { row: 4, column: 0, margin: 5 }),
                    $(go.TextBlock, new go.Binding("text", "tags"),
                        { row: 4, column: 1, margin: 5 }),
                    $(go.TextBlock, "Version: ", { row: 5, column: 0, margin: 5  }),
                    $(go.TextBlock, new go.Binding("text", "version"),
                        { row: 5, column: 1, margin: 5 }),
                    $(go.TextBlock, "Department: ", { row: 6, column: 0, margin: 5 }),
                    $(go.TextBlock, new go.Binding("text", "department"),
                        { row: 6, column: 1, margin: 5 }),
                    $(go.TextBlock, "Allowed Users: ", { row: 7, column: 0, margin: 5 }),
                    $(go.TextBlock, new go.Binding("text", "allowedUsers"),
                        { row: 7, column: 1, margin: 5 }),
                    $(go.TextBlock, "License: ", { row: 8, column: 0, margin: 5 }),
                    $(go.TextBlock, new go.Binding("text", "license"),
                        { row: 8, column: 1, margin: 5 }),
                    $(go.TextBlock, "Location: ", { row: 9, column: 0, margin: 5 }),
                    $(go.TextBlock, new go.Binding("text", "loc"),
                        { row: 9, column: 1, margin: 5 }),
                )
            )
/**
        //toolTip is used for the hover function
        toolTip: $(
            go.Adornment,
            //   "Auto",
            $(go.Shape, {
                fill: "white",
            }),
            $(
                go.Panel,
                "Vertical",
                $(go.TextBlock, "Description:"),
                $(go.TextBlock, new go.Binding("text", "desc")),
                $(go.TextBlock, "key_id:"),
                $(go.TextBlock, new go.Binding("text", "key"))
            )
        ),*/
    },
    //   $(
    //     go.Panel,
    //     "Table",
    //     $(go.RowColumnDefinition, { column: 0, alignment: go.Spot.Left }),
    //     $(go.RowColumnDefinition, { column: 2, alignment: go.Spot.Right }),
    //     $(
    //       go.TextBlock, // the node title
    //       {
    //         column: 0,
    //         row: 0,
    //         columnSpan: 3,
    //         alignment: go.Spot.Center,
    //         font: "bold 10pt sans-serif",
    //         margin: new go.Margin(4, 2),
    //       },
    //       new go.Binding("text", "key")
    //     ),
    //     $(
    //       go.Panel,
    //       "Horizontal",
    //       { column: 0, row: 1 },
    //       $(
    //         go.Shape, // the "A" port
    //         {
    //           width: 6,
    //           height: 6,
    //           portId: "A",
    //           toSpot: go.Spot.Left,
    //           toLinkable: true,
    //           toMaxLinks: 1,
    //           toLinkableDuplicates: true,
    //         }
    //       ), // allow user-drawn links from here
    //       $(go.TextBlock, "A") // "A" port label
    //     ),
    //     $(
    //       go.Panel,
    //       "Horizontal",
    //       { column: 0, row: 2 },
    //       $(
    //         go.Shape, // the "B" port
    //         {
    //           width: 6,
    //           height: 6,
    //           portId: "B",
    //           toSpot: go.Spot.Left,
    //           toLinkable: true,
    //           toMaxLinks: 1,
    //           toLinkableDuplicates: true,
    //         }
    //       ), // allow user-drawn links from here
    //       $(go.TextBlock, "B") // "B" port label
    //     ),
    //     $(
    //       go.Panel,
    //       "Horizontal",
    //       { column: 2, row: 1, rowSpan: 2 },
    //       $(go.TextBlock, "Out"), // "Out" port label
    //       $(
    //         go.Shape, // the "Out" port
    //         {
    //           width: 6,
    //           height: 6,
    //           portId: "Out",
    //           fromSpot: go.Spot.Right,
    //           fromLinkable: true,
    //           toLinkableDuplicates: true,
    //           fromLinkableDuplicates: true,
    //         }
    //       ) // allow user-drawn links to here
    //     )
    //   ),
    {
        // define a context menu for each node
        contextMenu: $(
            "ContextMenu",
            $(
                "ContextMenuButton",
                {
                    "ButtonBorder.fill": "white",
                    _buttonFillOver: "skyblue",
                },
                $(go.TextBlock, "delete"),
                {
                    click: deleteNode,
                }
            )
            // more ContextMenuButtons would go here
        ),
    }
);