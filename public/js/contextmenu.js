/*
* Copyright (c) 2021 Ecore. All rights reserved.
*
* University:        Frankfurt University of Applied Sciences
* Study program:     Engineering Business Information Systems
* Module:            Advanced Programming 2021
* Professor:         Prof. Dr. Jung, Prof. Dr. Bremm
* Date:              06.07.2021
*
*/

/**
 * Contains all functions that create, update or delete parts of the gojs diagram. Especially the node and link data
 * array.
 *
 * @author Feng Yi Lu, Anton Rösler
 */
let parentChildArrayGrew = 0;
let parentButton;
let before = 0;

const cxElement = document.getElementById("contextMenu");


/* Define custom context menu as html info element. */
const contextMenu = $(go.HTMLInfo, {
    show: showContextMenu,
    hide: hideContextMenu
});

diagram.contextMenu = contextMenu;

/**
 * Hides the context menu if active.
 */
function hideCX() {
    if (diagram.currentTool instanceof go.ContextMenuTool) {
        diagram.currentTool.doCancel();
    }
}

/**
 * Shows the context menu. Option depend on if parent-child-feature is active.
 */
function showContextMenu(obj, diagram) {
    let hasMenuItem = false;

    function maybeShowItem(elt, stat) {
        if (stat) {
            elt.style.display = "block";
            hasMenuItem = true;
        } else {
            elt.style.display = "none";
        }
    }

    maybeShowItem(document.getElementById("parent-opt"), parentChildFeatureOn && obj);
    maybeShowItem(document.getElementById("children-opt"), parentChildFeatureOn && obj);
    maybeShowItem(document.getElementById("pred-opt"), parentChildFeatureOn && obj);
    maybeShowItem(document.getElementById("desc-opt"), parentChildFeatureOn && obj);
    maybeShowItem(document.getElementById("back-opt"), parentChildFeatureOn);
    maybeShowItem(document.getElementById("isolate-opt"), !parentChildFeatureOn && obj);
    maybeShowItem(document.getElementById("delete-opt"), !parentChildFeatureOn && obj);
    maybeShowItem(document.getElementById("new-opt"), obj === null);
    maybeShowItem(document.getElementById("undo-opt"), obj === null);
    maybeShowItem(document.getElementById("redo-opt"), obj === null);


    if (hasMenuItem) {
        cxElement.classList.add("show-menu");
        const mousePt = diagram.lastInput.viewPoint;
        cxElement.style.left = mousePt.x + 5 + "px";
        cxElement.style.top = mousePt.y + "px";
    }
    window.addEventListener("click", hideCX, true);
}

function hideContextMenu() {
    cxElement.classList.remove("show-menu");
    window.removeEventListener("click", hideCX, true);
}

/**
 * Executes a command, that was triggered by a click on a context menu option.
 * @param event
 * @param val
 */
function cxcommand(event, val) {
    if (val === undefined) val = event.currentTarget.id;
    switch (val) {
        case "isolate-opt":
            hideAllOtherNodes();
            break;
        case "delete-opt":
            diagram.commandHandler.deleteSelection();
            break;
        case "parent-opt":
            showParents();
            break;
        case "children-opt":
            showChilds();
            break;
        case "pred-opt":
            showAllParentsContextmenu();
            break;
        case "desc-opt":
            showAllChildrenContextmenu();
            break;
        case "back-opt":
            showAll();
            break;
        case "new-opt":
            openCreateNodeModal();
            document.getElementById("contextMenu").value = "diagramContextMenu";
            break;
        case "undo-opt":
            diagram.commandHandler.undo();
            break;
        case "redo-opt":
            diagram.commandHandler.redo();
            break;

    }
    diagram.currentTool.stopTool();
}



function hideAllOtherNodes() {
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
    const selectedNode = getSelectedNode();
    const parents = new Set();
    getAllParentNodes(selectedNode, parents);
    for (const node of parents) {
        parentChildNodeSet.add(node);
    }
    updateDiagram();
}

function showAllChildrenContextmenu() {
    const selectedNode = getSelectedNode();
    const childs = new Set();
    getAllChildNodes(selectedNode, childs);
    for (const node of childs) {
        parentChildNodeSet.add(node);
    }
    updateDiagram();
}


function showParents() {
    const selectedNode = diagram.model.findNodeDataForKey(diagram.selection.toArray()[0].key);
    parentChildNodeSet.add(selectedNode);
    const parents = getNodesFromKeys(findParentsOfANode(selectedNode));
    for (const node of parents) {
        parentChildNodeSet.add(node);
    }
    parentButton = true;
    updateDiagram();
}

function showChilds() {
    const selectedNode = diagram.model.findNodeDataForKey(diagram.selection.toArray()[0].key);
    parentChildNodeSet.add(selectedNode);
    const childs = getNodesFromKeys(findChildsofANode(selectedNode));
    for (const node of childs) {
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
        } else {
            createToast("Child is not shown because of a filter", 'fail')
        }
    } else if (parentChildArrayGrew === 0) {
        if (parentButton === true) {
            createToast("This node has no parent left", 'fail')
        } else {
            createToast("This node has no child left", 'fail')
        }
    }
}

/**
 * function to handle different node adding possibilities depending on the hidden input value of "contextMenu"
 */
function handleContextMenuOptions(newNode) {
    var contextMenuValue = document.getElementById("contextMenu").value;
    if (contextMenuValue === "nodeContextMenuAdd") {
        const newLink = {from: diagram.selection.toArray()[0].key, to: newNode.key};
        addLinkToDiagram(newLink);
        if (appliedFilters.length > 0 || parentChildFeatureOn === true) {
            linkHandlerWhileFilterOn();
        }
        document.getElementById("contextMenu").value = "default";
    }
    if (contextMenuValue === "diagramContextMenu") {
        const part = diagram.findPartForData(newNode);
        pos = diagram.toolManager.contextMenuTool.mouseDownPoint;
        part.location = pos;
        document.getElementById("contextMenu").value = "default";
    }
}