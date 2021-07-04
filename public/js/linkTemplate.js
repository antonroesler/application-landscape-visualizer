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


var linkTemplate =
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
  //link Bindings
  new go.Binding("routing","routing", go.Binding.parseEnum(go.Link, go.Link.Normal)),
  new go.Binding("curve", "curve", go.Binding.parseEnum(go.Link, go.Link.Normal)),
  new go.Binding("curviness", "curviness"),
  new go.Binding("dash", "dash"),
  new go.Binding("points").makeTwoWay(),
  new go.Binding("opacity", "opacity"), // To make link transparent
  new go.Binding("text", "Bandwith"),
  new go.Binding("text", "Protocol"),
  new go.Binding("text", "Latency Level"),
  new go.Binding("text", "type"),
  
  // the highlight shape, normally transparent
  $(go.Shape,  
    { isPanelMain: true, strokeWidth: 8, stroke: "transparent", name: "HIGHLIGHT" }),
    
  // the link path shape
  $(go.Shape,  
    { isPanelMain: true, stroke: "gray", strokeWidth: 2 },
      new go.Binding("stroke", "isSelected", function(sel) { return sel ? "rgb(20, 124, 229)" : "gray"; }).ofObject(),
      new go.Binding("strokeDashArray", "dash")),
      

  // the arrowhead
  $(go.Shape,  
    { toArrow: "standard", strokeWidth: 0, fill: "gray" },
      new go.Binding("fill", "isSelected", function(sel) { return sel ? "rgb(20, 124, 229)" : "gray"; }).ofObject()),
  );