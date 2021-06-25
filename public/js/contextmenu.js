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
var parentChildArrayGrew = 0;
var parentButton;
var before = 0;
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
    diagramNodeParentChildBeforeFilterIsActive.add(diagram.model.findNodeDataForKey(diagram.selection.toArray()[0].key));
    parentChildNodeSet.add(diagram.model.findNodeDataForKey(diagram.selection.toArray()[0].key));
    diagram.startTransaction();
    model.nodeDataArray = Array.from(parentChildNodeSet);
    model.linkDataArray = [];
    diagram.commitTransaction("all other nodes have been hid");
    parentChildFeatureOn = true;
    parentChildArrayGrew = 0;
}

function showAllActivate() {
    var noDublicates = new Set(modelNodeWithoutFilter);
    diagram.startTransaction();
    model.nodeDataArray = Array.from(noDublicates);
    model.linkDataArray = modelLinkWithoutFilter;
    diagram.updateAllRelationshipsFromData();
    diagram.updateAllTargetBindings();
    diagram.commitTransaction("parentChild view removed");
    parentChildFeatureOn = false;
    parentChildArrayGrew = 0;
}

function showAll() {
    allParentChildKeys.clear();
    parentChildNodeSet.clear();
    parentChildLinkArray = [];
    diagramLinkParentChildBeforeFilterIsActive = [];
    diagramNodeParentChildBeforeFilterIsActive.clear();
    diagram.nodeTemplate = mainTemplate;
    if (moreThanOneFilter === true) {
        showAllActivate();
        applyAllFilters();
    } else {
        showAllActivate();
    }
}
function showAllParentsContextmenu() {
    selectedNode = getSelectedNode();
    parents = new Set();
    getAllParentNodes(selectedNode, parents);
    for (node of parents) {
        parentChildNodeSet.add(node);
    }
    updateDiagram();
}

function showAllChildrenContextmenu() {
    selectedNode = getSelectedNode();
    childs = new Set();
    getAllChildNodes(selectedNode, childs);
    for (node of childs) {
        parentChildNodeSet.add(node);
    }
    updateDiagram();
}


function showParents() {
    selectedNode = diagram.model.findNodeDataForKey(diagram.selection.toArray()[0].key);
    parentChildNodeSet.add(selectedNode);
    parents = getParentsChildFromKey(findParentsOfANode(selectedNode));
    for (node of parents) {
        parentChildNodeSet.add(node);
    }
    parentButton = true;
    updateDiagram();
}

function showChilds() {
    selectedNode = diagram.model.findNodeDataForKey(diagram.selection.toArray()[0].key);
    parentChildNodeSet.add(selectedNode);
    childs = getParentsChildFromKey(findChildsofANode(selectedNode));
    for (node of childs) {
        parentChildNodeSet.add(node);
    }
    parentButton = false;
    updateDiagram();
}

function updateDiagram() {
    before = model.nodeDataArray.length;
    diagram.startTransaction();
    model.nodeDataArray = Array.from(parentChildNodeSet);
    model.linkDataArray = parentChildLinkArray;
    diagram.updateAllRelationshipsFromData();
    diagram.updateAllTargetBindings();
    diagram.commitTransaction("updated");
    diagramNodeParentChildBeforeFilterIsActive = parentChildNodeSet;
    diagramLinkParentChildBeforeFilterIsActive = parentChildLinkArray;
    applyAllFilters();
    toastAlert();
    parentChildArrayGrew = 0;
}


function toastAlert() {
    if (parentChildArrayGrew > 0 && model.nodeDataArray.length === before && appliedFilters.length != 0) {
        if (parentButton === true) {
            createToast("Parent is not shown because of a filter", 'fail')
        }
        else {
            createToast("Child is not shown because of a filter", 'fail')
        }
    } else if (parentChildArrayGrew === 0) {
        if (parentButton === true) {
            createToast("This node has no parents left", 'fail')
        }
        else {
            createToast("This node has no childrens left", 'fail')
        }
    }
}

/**function to handle diffrent node adding possibilities depending 
  on the hidden input value of "contextMenu" */
function handleContextMenuOptions(newNode) {
    var contextMenuValue = document.getElementById("contextMenu").value;
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