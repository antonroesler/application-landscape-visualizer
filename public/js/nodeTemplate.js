/*
 * Copyright (c) 2021 Ecore. All rights reserved.
 *
 * University:        Frankfurt University of Applied Sciences
 * Study program:     Engineering Business Information Systems
 * Module:            Advanced Programming 2021
 * Professor:         Prof. Dr. Jung, Prof. Dr. Bremm
 * Date:              05.07.2021
 *
 *
 */

/**
 * Contains the node template that defines style and functionality of a gojs node object. Also contains the gojs context
 * menu.
 *
 * @author Feng Yi Lu, Benedikt Möller, Anton Roesler
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
            if (!e.diagram.isReadOnly) port.fill = "rgba(20, 124, 229,0.7)";
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
    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
    $(
        go.Panel,
        "Auto",
        $(
            go.Shape,
            {
                background: "transparent",
                fill: "black",
                strokeWidth: 0,
                width: nodeWidth,
                height: 70,
                opacity: 1.0,
            },
            new go.Binding("geometry", "category", geoFunc),
            new go.Binding("opacity", "opacity"),
            new go.Binding("stroke", "stroke"),
            new go.Binding("background", "color"),
            new go.Binding("strokeWidth", "strokeWidth"),
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
            opacity: 1.0,
        },
        new go.Binding("text", "name"),
        new go.Binding("opacity", "opacityText"),
    ),
    makePort("B", go.Spot.Bottom, go.Spot.BottomSide, true, true),
    new go.Binding("text", "tags"),
    new go.Binding("text", "version"),
    new go.Binding("text", "departments"),
    new go.Binding("text", "license"),
    {
        //toolTip is used for the hover function
        toolTip:
            $("ToolTip",
                $(go.Panel, "Table",
                    {defaultAlignment: go.Spot.Left},
                    $(go.TextBlock, "Name: ", {row: 1, column: 0, margin: 5, font: "bold 12pt sans-serif"}),
                    $(go.TextBlock, new go.Binding("text", "name"),
                        {row: 1, column: 1, margin: 5}),
                    $(go.TextBlock, "Application Type: ", {row: 2, column: 0, margin: 5, font: "bold 12pt sans-serif"}),
                    $(go.TextBlock, new go.Binding("text", "category"),
                        {row: 2, column: 1, margin: 5}),
                    $(go.TextBlock, "Description: ", {row: 3, column: 0, margin: 5, font: "bold 12pt sans-serif"}),
                    $(go.TextBlock, new go.Binding("text", "desc"),
                        {
                            row: 3, column: 1, margin: 5, overflow: go.TextBlock.OverflowEllipsis,
                            maxLines: 1,
                            width: 100
                        }),
                    $(go.TextBlock, "Tags: ", {row: 4, column: 0, margin: 5, font: "bold 12pt sans-serif"}),
                    $(go.TextBlock, new go.Binding("text", "tags"),
                        {
                            row: 4, column: 1, margin: 5, overflow: go.TextBlock.OverflowEllipsis,
                            maxLines: 1,
                            width: 100
                        }),
                    $(go.TextBlock, "Version: ", {row: 5, column: 0, margin: 5, font: "bold 12pt sans-serif"}),
                    $(go.TextBlock, new go.Binding("text", "version"),
                        {row: 5, column: 1, margin: 5}),
                    $(go.TextBlock, "Departments: ", {row: 6, column: 0, margin: 5, font: "bold 12pt sans-serif"}),
                    $(go.TextBlock, new go.Binding("text", "departments"),
                        {
                            row: 6, column: 1, margin: 5, overflow: go.TextBlock.OverflowEllipsis,
                            maxLines: 1,
                            width: 100
                        }),
                    $(go.TextBlock, "License: ", {row: 8, column: 0, margin: 5, font: "bold 12pt sans-serif"}),
                    $(go.TextBlock, new go.Binding("text", "license"),
                        {row: 8, column: 1, margin: 5}),
                )
            )
    },
    {
        // define a context menu for each node
        contextMenu: contextMenu
    }
);