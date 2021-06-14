/*
* Copyright (c) 2021 Ecore. All rights reserved.
*
* University:        Frankfurt University of Applied Sciences
* Study program:     Engineering Business Information Systems
* Module:            Advanced Programming 2021
* Professor:         Prof. Dr. Jung, Prof. Dr. Bremm
* Date:              21.04.2021
*
*/

/**
 * Contains all functions that create, update or delete parts of the gojs diagram. Especially the node and link data
 * array.
 *
 * @author Feng Yi Lu
 */

/**main contextMenu of the diagram*/
diagram.contextMenu =
    $("ContextMenu",
        $("ContextMenuButton",
            $(go.TextBlock, "Undo"),
            { click: function (e, obj) { e.diagram.commandHandler.undo(); } },
            new go.Binding("visible", "", function (o) {
                return o.diagram.commandHandler.canUndo();
            }).ofObject()),
        $("ContextMenuButton",
            $(go.TextBlock, "Redo"),
            { click: function (e, obj) { e.diagram.commandHandler.redo(); } },
            new go.Binding("visible", "", function (o) {
                return o.diagram.commandHandler.canRedo();
            }).ofObject()),
        $("ContextMenuButton",
            $(go.TextBlock, "New Node"),
            {
                click: function (e, obj) {
                    e.diagram.commit(function (d) {
                        openCreateNodeModal()
                        document.getElementById("contextMenu").value = "diagramContextMenu";

                    });
                }
            }
        )
    );


function addNodeAndLink() {
    document.getElementById("contextMenu").value = "nodeContextMenuAdd";
    openCreateNodeModal()
}


function hideAllOtherNodes() {
    diagram.nodeTemplate = mainTemplateParentChild;
    parentChildNodeSet.add(diagram.model.findNodeDataForKey(diagram.selection.toArray()[0].key));
    diagram.startTransaction();
    model.nodeDataArray = Array.from(parentChildNodeSet);
    model.linkDataArray = [];
    diagram.commitTransaction("all other nodes have been hid");
}

function showAll() {
    allParentChildKeys.clear();
    parentChildNodeSet.clear();
    parentChildLinkArray = [];
    diagram.nodeTemplate = mainTemplate;
    if (moreThanOneFilter === true) {
        diagram.startTransaction();
        model.nodeDataArray = diagramNodeWhenFilterIsActive;
        model.linkDataArray = diagramLinkWhenFilterIsActive;
        diagram.updateAllRelationshipsFromData();
        diagram.updateAllTargetBindings();
        diagram.commitTransaction("parentChild view removed");
    } else {
        diagram.startTransaction();
        model.nodeDataArray = modelNodeWithoutFilter;
        model.linkDataArray = modelLinkWithoutFilter;
        diagram.updateAllRelationshipsFromData();
        diagram.updateAllTargetBindings();
        diagram.commitTransaction("parentChild view removed");
    }
}

function showParents() {
    selectedNode = diagram.model.findNodeDataForKey(diagram.selection.toArray()[0].key);
    parents = getParentsChildFromKey(findParentsOfANode(selectedNode));
    for (node of parents) {
        parentChildNodeSet.add(node);
    }
    updateDiagram();
}

function showChilds() {
    selectedNode = diagram.model.findNodeDataForKey(diagram.selection.toArray()[0].key);
    childs = getParentsChildFromKey(findChildsofANode(selectedNode));
    for (node of childs) {
        parentChildNodeSet.add(node);
    }
    updateDiagram();
}

function updateDiagram() {
    diagram.startTransaction();
    model.nodeDataArray = Array.from(parentChildNodeSet);
    model.linkDataArray = parentChildLinkArray;
    diagram.updateAllRelationshipsFromData();
    diagram.updateAllTargetBindings();
    diagram.commitTransaction("all other nodes have been hid");

}

/**function to handle diffrent node adding possibilities depending 
  on the hidden input value of "contextMenu" */
function handleContextMenuOptions(newNode) {
    var contextMenuValue = document.getElementById("contextMenu").value;
    console.log(contextMenuValue === "diagramContextMenu")
    if (contextMenuValue === "nodeContextMenuAdd") {
        const newLink = { from: diagram.selection.toArray()[0].key, to: newNode.key };
        addLinkToDiagram(newLink);
        document.getElementById("contextMenu").value = "default";
    }
    if (contextMenuValue === "diagramContextMenu") {
        const part = diagram.findPartForData(newNode);
        pos = diagram.toolManager.contextMenuTool.mouseDownPoint;
        part.location = pos;
        document.getElementById("contextMenu").value = "default";
    }
}