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
* @author Benedikt Möller
*        
*/
function stdLink(){

new go.Binding("points").makeTwoWay(),
$(go.Shape,  // the highlight shape, normally transparent
  { isPanelMain: true, strokeWidth: 8, stroke: "transparent", name: "HIGHLIGHT" }),
$(go.Shape,  // the link path shape
  { isPanelMain: true, stroke: "gray", strokeWidth: 2 },
  new go.Binding("stroke", "isSelected", function(sel) { return sel ? "rgb(20, 124, 229)" : "gray"; }).ofObject()),
$(go.Shape,  // the arrowhead
  { toArrow: "standard", strokeWidth: 0, fill: "gray" },
  new go.Binding("fill", "isSelected", function(sel) { return sel ? "rgb(20, 124, 229)" : "gray"; }).ofObject()),

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
        $(go.TextBlock, "change Behaviour"),
        {
          click: deleteNode,
        }
      )
      // more ContextMenuButtons would go here
    ),
  }
}

function getLink(){


}

var linkTemplateBezier =
$(go.Link,
  {
    routing: go.Link.Normal,
    curve: go.Link.Bezier,
    curviness: 30,
    mouseEnter: function(e, link) { link.findObject("HIGHLIGHT").stroke = "rgba(20, 124, 229,0.3)"; },
    mouseLeave: function(e, link) { link.findObject("HIGHLIGHT").stroke = "transparent"; },
    selectionAdorned: false
    
},
// stdLink()
new go.Binding("points").makeTwoWay(),
        $(go.Shape,  // the highlight shape, normally transparent
          { isPanelMain: true, strokeWidth: 8, stroke: "transparent", name: "HIGHLIGHT" }),
        $(go.Shape,  // the link path shape
          { isPanelMain: true, stroke: "gray", strokeWidth: 2 },
          new go.Binding("stroke", "isSelected", function(sel) { return sel ? "rgb(20, 124, 229)" : "gray"; }).ofObject()),
        $(go.Shape,  // the arrowhead
          { toArrow: "standard", strokeWidth: 0, fill: "gray" },
          new go.Binding("fill", "isSelected", function(sel) { return sel ? "rgb(20, 124, 229)" : "gray"; }).ofObject()),
  );
var linkTemplateOrthogonal =
$(go.Link,
  {
    routing: go.Link.Orthogonal,
    curviness: 30,
    mouseEnter: function(e, link) { link.findObject("HIGHLIGHT").stroke = "rgba(20, 124, 229,0.3)"; },
    mouseLeave: function(e, link) { link.findObject("HIGHLIGHT").stroke = "transparent"; },
    selectionAdorned: false
    
},
new go.Binding("points").makeTwoWay(),
        $(go.Shape,  // the highlight shape, normally transparent
          { isPanelMain: true, strokeWidth: 8, stroke: "transparent", name: "HIGHLIGHT" }),
        $(go.Shape,  // the link path shape
          { isPanelMain: true, stroke: "gray", strokeWidth: 2 },
          new go.Binding("stroke", "isSelected", function(sel) { return sel ? "rgb(20, 124, 229)" : "gray"; }).ofObject()),
        $(go.Shape,  // the arrowhead
          { toArrow: "standard", strokeWidth: 0, fill: "gray" },
          new go.Binding("fill", "isSelected", function(sel) { return sel ? "rgb(20, 124, 229)" : "gray"; }).ofObject()),
  );


var linkTemplateNormal =
$(go.Link,
  {
    mouseEnter: function(e, link) { link.findObject("HIGHLIGHT").stroke = "rgba(20, 124, 229,0.3)"; },
    mouseLeave: function(e, link) { link.findObject("HIGHLIGHT").stroke = "transparent"; },
    selectionAdorned: false
},
new go.Binding("points").makeTwoWay(),
        $(go.Shape,  // the highlight shape, normally transparent
          { isPanelMain: true, strokeWidth: 8, stroke: "transparent", name: "HIGHLIGHT" }),
        $(go.Shape,  // the link path shape
          { isPanelMain: true, stroke: "gray", strokeWidth: 2 },
          new go.Binding("stroke", "isSelected", function(sel) { return sel ? "rgb(20, 124, 229)" : "gray"; }).ofObject()),
        $(go.Shape,  // the arrowhead
          { toArrow: "standard", strokeWidth: 0, fill: "gray" },
          new go.Binding("fill", "isSelected", function(sel) { return sel ? "rgb(20, 124, 229)" : "gray"; }).ofObject()),
  );


var linkTemplateAvoidsNodes =
    $(go.Link,
        {
            routing: go.Link.AvoidsNodes,
            toShortLength: 3,
            corner: 5,
            curve: go.Link.JumpOver,

            mouseEnter: function(e, link) { link.findObject("HIGHLIGHT").stroke = "rgba(20, 124, 229,0.3)"; },
            mouseLeave: function(e, link) { link.findObject("HIGHLIGHT").stroke = "transparent"; },
            selectionAdorned: false
         
        },
        new go.Binding("points").makeTwoWay(),
        $(go.Shape,  // the highlight shape, normally transparent
          { isPanelMain: true, strokeWidth: 8, stroke: "transparent", name: "HIGHLIGHT" }),
        $(go.Shape,  // the link path shape
          { isPanelMain: true, stroke: "gray", strokeWidth: 2 },
          new go.Binding("stroke", "isSelected", function(sel) { return sel ? "rgb(20, 124, 229)" : "gray"; }).ofObject()),
        $(go.Shape,  // the arrowhead
          { toArrow: "standard", strokeWidth: 0, fill: "gray" },
          new go.Binding("fill", "isSelected", function(sel) { return sel ? "rgb(20, 124, 229)" : "gray"; }).ofObject()),
          new go.Binding("text", "Bandwith"),
          new go.Binding("text", "Protocol"),
          new go.Binding("text", "Latency Level"),
          new go.Binding("text", "Type"),

          {
            //toolTip is used for the hover function
            toolTip:
                    $("ToolTip",
                        $(go.Panel, "Table",
                            { defaultAlignment: go.Spot.Left },
                            $(go.TextBlock, "ID: ", { row: 0, column: 0, margin: 5 }),
                            $(go.TextBlock, new go.Binding("text", "key"),
                                { row: 0, column: 1, margin: 5 }),
                            $(go.TextBlock, "Bandwith: ", { row: 1, column: 0, margin: 5 }),
                            $(go.TextBlock, new go.Binding("text", "Bandwith"),
                                { row: 1, column: 1, margin: 5 }),
                            $(go.TextBlock, "Protocol: ", { row: 2, column: 0, margin: 5 }),
                            $(go.TextBlock, new go.Binding("text", "Protocol"),
                                { row: 2, column: 1, margin: 5 }),
                            $(go.TextBlock, "Latency Level: ", { row: 3, column: 0, margin: 5 }),
                            $(go.TextBlock, new go.Binding("text", "Latency Level"),
                                { row: 3, column: 1, margin: 5 }),
                            $(go.TextBlock, "Type: ", { row: 4, column: 0, margin: 5 }),
                            $(go.TextBlock, new go.Binding("text", "Type"),
                                { row: 4, column: 1, margin: 5 }),
                        )
                    )
          },

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
                $(go.TextBlock, "change Behaviour"),
                {
                  click: deleteNode,
                }
              )
              // more ContextMenuButtons would go here
            ),
          }
        // $(go.Panel, "Auto",  // the link label, normally not visible
        //   { visible: false, name: "LABEL", segmentIndex: 2, segmentFraction: 0.5 },
        //   new go.Binding("visible", "visible").makeTwoWay(),
        //   $(go.Shape, "RoundedRectangle",  // the label shape
        //     { fill: "#F8F8F8", strokeWidth: 0 }),
        //   $(go.TextBlock, "Yes",  // the label
        //     {
        //       textAlign: "center",
        //       font: "10pt helvetica, arial, sans-serif",
        //       stroke: "#333333",
        //       editable: true
        //     },
        //     new go.Binding("text").makeTwoWay())
        // ),
        // $(go.Shape, { isPanelMain: true }),  // default stroke === "black", strokeWidth === 1
        // $(go.Shape, { toArrow: "Standard", scale: 1 })

    );


// var linkTemplateMap = new go.Map();
// linkTemplateMap.add("", linkTemplateNormal);
// linkTemplateMap.add("standard", linkTemplate);
