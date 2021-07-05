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
 * @author Feng Yi Lu, Benedikt Möller
 *
 */
var parentChildFeature = false;
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

function getColor(x) {
    console.log(x);
    return "red"
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

var parentChildFeatureNotActive = $(go.HTMLInfo,{
    show: showContextMenu,
    hide: hideContextMenu
});

function hideCX() {
    if (myDiagram.currentTool instanceof go.ContextMenuTool) {
        myDiagram.currentTool.doCancel();
    }
}
var cxElement = document.getElementById("contextMenu");
function showContextMenu(obj, diagram, tool) {
    // Show only the relevant buttons given the current state.
    var cmd = diagram.commandHandler;
    var hasMenuItem = false;
    function maybeShowItem(elt, pred) {
        if (pred) {
            elt.style.display = "block";
            hasMenuItem = true;
        } else {
            elt.style.display = "none";
        }
    }
    maybeShowItem(document.getElementById("cut"), cmd.canCutSelection());
    maybeShowItem(document.getElementById("copy"), cmd.canCopySelection());
    maybeShowItem(document.getElementById("paste"), cmd.canPasteSelection(diagram.toolManager.contextMenuTool.mouseDownPoint));
    maybeShowItem(document.getElementById("delete"), cmd.canDeleteSelection());
    maybeShowItem(document.getElementById("color"), obj !== null);

    // Now show the whole context menu element
    if (hasMenuItem) {
        cxElement.classList.add("show-menu");
        // we don't bother overriding positionContextMenu, we just do it here:
        var mousePt = diagram.lastInput.viewPoint;
        cxElement.style.left = mousePt.x + 5 + "px";
        cxElement.style.top = mousePt.y + "px";
    }

    // Optional: Use a `window` click listener with event capture to
    //           remove the context menu if the user clicks elsewhere on the page
    window.addEventListener("click", hideCX, true);
}

function hideContextMenu() {
    cxElement.classList.remove("show-menu");
    // Optional: Use a `window` click listener with event capture to
    //           remove the context menu if the user clicks elsewhere on the page
    window.removeEventListener("click", hideCX, true);
}

// This is the general menu command handler, parameterized by the name of the command.
function cxcommand(event, val) {
    if (val === undefined) val = event.currentTarget.id;
    var diagram = myDiagram;
    switch (val) {
        case "cut": diagram.commandHandler.cutSelection(); break;
        case "copy": diagram.commandHandler.copySelection(); break;
        case "paste": diagram.commandHandler.pasteSelection(diagram.toolManager.contextMenuTool.mouseDownPoint); break;
        case "delete": diagram.commandHandler.deleteSelection(); break;
        case "color": {
            var color = window.getComputedStyle(event.target)['background-color'];
            changeColor(diagram, color); break;
        }
    }
    diagram.currentTool.stopTool();
}

// A custom command, for changing the color of the selected node(s).
function changeColor(diagram, color) {
    // Always make changes in a transaction, except when initializing the diagram.
    diagram.startTransaction("change color");
    diagram.selection.each(function(node) {
        if (node instanceof go.Node) {  // ignore any selected Links and simple Parts
            // Examine and modify the data, not the Node directly.
            var data = node.data;
            // Call setDataProperty to support undo/redo as well as
            // automatically evaluating any relevant bindings.
            diagram.model.setDataProperty(data, "color", color);
        }
    });
    diagram.commitTransaction("change color");
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
                    { defaultAlignment: go.Spot.Left },
                    $(go.TextBlock, "Name: ", { row: 1, column: 0, margin: 5, font: "bold 12pt sans-serif" }),
                    $(go.TextBlock, new go.Binding("text", "name"),
                        { row: 1, column: 1, margin: 5 }),
                    $(go.TextBlock, "Application Type: ", { row: 2, column: 0, margin: 5, font: "bold 12pt sans-serif" }),
                    $(go.TextBlock, new go.Binding("text", "category"),
                        { row: 2, column: 1, margin: 5 }),
                    $(go.TextBlock, "Description: ", { row: 3, column: 0, margin: 5, font: "bold 12pt sans-serif" }),
                    $(go.TextBlock, new go.Binding("text", "desc"),
                        {
                            row: 3, column: 1, margin: 5, overflow: go.TextBlock.OverflowEllipsis,
                            maxLines: 1,
                            width: 100
                        }),
                    $(go.TextBlock, "Tags: ", { row: 4, column: 0, margin: 5, font: "bold 12pt sans-serif" }),
                    $(go.TextBlock, new go.Binding("text", "tags"),
                        {
                            row: 4, column: 1, margin: 5, overflow: go.TextBlock.OverflowEllipsis,
                            maxLines: 1,
                            width: 100
                        }),
                    $(go.TextBlock, "Version: ", { row: 5, column: 0, margin: 5, font: "bold 12pt sans-serif" }),
                    $(go.TextBlock, new go.Binding("text", "version"),
                        { row: 5, column: 1, margin: 5 }),
                    $(go.TextBlock, "Departments: ", { row: 6, column: 0, margin: 5, font: "bold 12pt sans-serif" }),
                    $(go.TextBlock, new go.Binding("text", "departments"),
                        {
                            row: 6, column: 1, margin: 5, overflow: go.TextBlock.OverflowEllipsis,
                            maxLines: 1,
                            width: 100
                        }),
                    $(go.TextBlock, "License: ", { row: 8, column: 0, margin: 5, font: "bold 12pt sans-serif" }),
                    $(go.TextBlock, new go.Binding("text", "license"),
                        { row: 8, column: 1, margin: 5 }),
                )
            )
    },
    {
        // define a context menu for each node
        contextMenu: parentChildFeatureNotActive
    }
);


var parentChildFeatureActive = $("ContextMenu",
    $(
        "ContextMenuButton",
        {
            "ButtonBorder.fill": "white",
            _buttonFillOver: "skyblue",
        },
        $(go.TextBlock, "Show parents"),
        {
            click: showParents,
        }
    ), $(
        "ContextMenuButton",
        {
            "ButtonBorder.fill": "white",
            _buttonFillOver: "skyblue",
        },
        $(go.TextBlock, "Show all predecessors"),
        {
            click: showAllParentsContextmenu,
        }
    ), $("ContextMenuButton", {
        "ButtonBorder.fill": "white",
        _buttonFillOver: "skyblue",
    },
        $(go.TextBlock, "Show children\n"),
        {
            click: showChilds,
        }
    ), $(
        "ContextMenuButton",
        {
            "ButtonBorder.fill": "white",
            _buttonFillOver: "skyblue",
        },
        $(go.TextBlock, "Show descendants"),
        {
            click: showAllChildrenContextmenu,
        }
    ), $("ContextMenuButton", {
        "ButtonBorder.fill": "white",
        _buttonFillOver: "skyblue",
    },
        $(go.TextBlock, "Back to whole diagram"),
        {
            click: showAll,
        }
    ),
)







var mainTemplateParentChild = $(
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
                    { defaultAlignment: go.Spot.Left },
                    $(go.TextBlock, "Name: ", { row: 1, column: 0, margin: 5, font: "bold 12pt sans-serif" }),
                    $(go.TextBlock, new go.Binding("text", "name"),
                        { row: 1, column: 1, margin: 5 }),
                    $(go.TextBlock, "Application Type: ", { row: 2, column: 0, margin: 5, font: "bold 12pt sans-serif" }),
                    $(go.TextBlock, new go.Binding("text", "category"),
                        { row: 2, column: 1, margin: 5 }),
                    $(go.TextBlock, "Description: ", { row: 3, column: 0, margin: 5, font: "bold 12pt sans-serif" }),
                    $(go.TextBlock, new go.Binding("text", "desc"),
                        {
                            row: 3, column: 1, margin: 5, overflow: go.TextBlock.OverflowEllipsis,
                            maxLines: 1,
                            width: 100
                        }),
                    $(go.TextBlock, "Tags: ", { row: 4, column: 0, margin: 5, font: "bold 12pt sans-serif" }),
                    $(go.TextBlock, new go.Binding("text", "tags"),
                        {
                            row: 4, column: 1, margin: 5, overflow: go.TextBlock.OverflowEllipsis,
                            maxLines: 1,
                            width: 100
                        }),
                    $(go.TextBlock, "Version: ", { row: 5, column: 0, margin: 5, font: "bold 12pt sans-serif" }),
                    $(go.TextBlock, new go.Binding("text", "version"),
                        { row: 5, column: 1, margin: 5 }),
                    $(go.TextBlock, "Departments: ", { row: 6, column: 0, margin: 5, font: "bold 12pt sans-serif" }),
                    $(go.TextBlock, new go.Binding("text", "departments"),
                        {
                            row: 6, column: 1, margin: 5, overflow: go.TextBlock.OverflowEllipsis,
                            maxLines: 1,
                            width: 100
                        }),
                    $(go.TextBlock, "License: ", { row: 8, column: 0, margin: 5, font: "bold 12pt sans-serif" }),
                    $(go.TextBlock, new go.Binding("text", "license"),
                        { row: 8, column: 1, margin: 5 }),
                )
            )
    },
    {
        // define a context menu for each node
        contextMenu: parentChildFeatureActive

    }
);