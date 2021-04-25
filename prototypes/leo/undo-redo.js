/*
* Copyright (c) 2021 Ecore. All rights reserved.
*
* University:		   Frankfurt University of Applied Sciences
* Study program:	 Engineering Business Information Systems
* Semester:		     Advanced Programming 20/21
* Professor:		   Prof. Dr. Jung, Prof. Dr. Bremm
* Date:			       21.04.2021
*
*/

/**
* Prototyping script to get used to go.js.
* Implementing an undo and redo button.
* @author Leonard Hußke
*
*/
function init() {
  var $ = go.GraphObject.make;
  myDiagram = $(go.Diagram, "myDiagramDiv",
  {
    // allow double click in background to create a new node
    "clickCreatingTool.archetypeNodeData": { text: "Node", color: "white" },

    // enable undo & redo
    "undoManager.isEnabled": true
  });

  // To simplify this code we define a function for creating a context menu button:
  function makeButton(text, action, visiblePredicate) {
    return $("ContextMenuButton",
    $(go.TextBlock, text),
    { click: action },
    // don't bother with binding GraphObject.visible if there's no predicate
    visiblePredicate ? new go.Binding("visible", "", function(o, e) { return o.diagram ? visiblePredicate(o, e) : false; }).ofObject() : {});
  }

// a context menu is an Adornment with a bunch of buttons in them
  var partContextMenu =
    $("ContextMenu",
    makeButton("Properties",
    function(e, obj) {  // OBJ is this Button
      var contextmenu = obj.part;  // the Button is in the context menu Adornment
      var part = contextmenu.adornedPart;  // the adornedPart is the Part that the context menu adorns
      // now can do something with PART, or with its data, or with the Adornment (the context menu)
      if (part instanceof go.Link) alert(linkInfo(part.data));
      else if (part instanceof go.Group) alert(groupInfo(contextmenu));
      else alert(nodeInfo(part.data));
    }),
    makeButton("Cut",
    function(e, obj) { e.diagram.commandHandler.cutSelection(); },
    function(o) { return o.diagram.commandHandler.canCutSelection(); }),
    makeButton("Copy",
    function(e, obj) { e.diagram.commandHandler.copySelection(); },
    function(o) { return o.diagram.commandHandler.canCopySelection(); }),
    makeButton("Paste",
    function(e, obj) { e.diagram.commandHandler.pasteSelection(e.diagram.toolManager.contextMenuTool.mouseDownPoint); },
    function(o) { return o.diagram.commandHandler.canPasteSelection(o.diagram.toolManager.contextMenuTool.mouseDownPoint); }),
    makeButton("Delete",
    function(e, obj) { e.diagram.commandHandler.deleteSelection(); },
    function(o) { return o.diagram.commandHandler.canDeleteSelection(); }),
    makeButton("Undo",
    function(e, obj) { e.diagram.commandHandler.undo(); },
    function(o) { return o.diagram.commandHandler.canUndo(); }),
    makeButton("Redo",
    function(e, obj) { e.diagram.commandHandler.redo(); },
    function(o) { return o.diagram.commandHandler.canRedo(); }),
    makeButton("Group",
    function(e, obj) { e.diagram.commandHandler.groupSelection(); },
    function(o) { return o.diagram.commandHandler.canGroupSelection(); }),
    makeButton("Ungroup",
    function(e, obj) { e.diagram.commandHandler.ungroupSelection(); },
    function(o) { return o.diagram.commandHandler.canUngroupSelection(); })
  );

  function nodeInfo(d) {  // Tooltip info for a node data object
    var str = "Node " + d.key + ": " + d.text + "\n";
    if (d.group)
    str += "member of " + d.group;
    else
    str += "top-level node";
    return str;
  }


  // provide a context menu for the background of the Diagram, when not over any Part
  myDiagram.contextMenu =
    $("ContextMenu",
    makeButton("Paste",
    function(e, obj) { e.diagram.commandHandler.pasteSelection(e.diagram.toolManager.contextMenuTool.mouseDownPoint); },
    function(o) { return o.diagram.commandHandler.canPasteSelection(o.diagram.toolManager.contextMenuTool.mouseDownPoint); }),
    makeButton("Undo",
    function(e, obj) { e.diagram.commandHandler.undo(); },
    function(o) { return o.diagram.commandHandler.canUndo(); }),
    makeButton("Redo",
    function(e, obj) { e.diagram.commandHandler.redo(); },
    function(o) { return o.diagram.commandHandler.canRedo(); })
  );

  var nodeDataArray = [
    { key: 1, text: "Alpha", color: "lightblue" },
    { key: 2, text: "Beta", color: "orange" },
    { key: 3, text: "Gamma", color: "lightgreen", group: 5 },
    { key: 4, text: "Delta", color: "pink", group: 5 },
    { key: 5, text: "Epsilon", color: "green", isGroup: true }
  ];
  var linkDataArray = [
    { from: 1, to: 2, color: "blue" },
    { from: 2, to: 2 },
    { from: 3, to: 4, color: "green" },
    { from: 3, to: 1, color: "purple" }
  ];
  myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
}
