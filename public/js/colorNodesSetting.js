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
 * Contains all functions to color nodes.
 *
 * @author Feng Yi Lu, Anton Roesler
 */

/* HTML Handler Methods */


/**
 * Reads values from html fields and calls appropriate function to color nodes by user specified values.
 */
function applyUserColorSetting() {
    const dataField = readColorMetaDataField()
    if (dataField.endsWith("Date")) {
        colorNodesByDate(dataField)
    } else if (dataField === 'distance') {
        colorNodesByDistance()
    } else
        colorAllNodesByAttribute(dataField)
}


/**
 * Adds a color to a given node.
 * @param node
 * @param color in any valid css format
 */
function addColorToNode(node, color) {
    diagram.model.commit(function (m) {
        m.set(node, "color", color)
    }, "add setting");
}

/**
 * Remove color from node. (Makes background color transparent)
 * @param node
 */
function removeColorFromNode(node) {
    addColorToNode(node, "transparent")
}

/**
 * Colors all nodes in the given node array with the specified color.
 * @param nodeArray an array of nodes
 * @param color in any valid css format
 */
function colorAllNodes(nodeArray, color) {
    nodeArray.forEach(node => {
        addColorToNode(node, color);
    })
}

/**
 * Removes color from all nodes in the nodeDataArray
 */
function removeColorFromAllNodes() {
    model.nodeDataArray.forEach(node => {
        removeColorFromNode(node);
    })
}

/**
 * Colors all nodes that have the same value for the same specified metadata filed in the same color.
 *
 * @param attributeName e.g. category, license, tag...
 */
async function colorAllNodesByAttribute(attributeName) {
    const nodes = {};
    model.nodeDataArray.forEach(node => {
        if (nodes[node[attributeName]]) {
            nodes[node[attributeName]].push(node)
        } else {
            nodes[node[attributeName]] = [node]
        }
    })
    await colorCategorizedNodeMap(nodes);
}

/**
 * Colors all nodes by a date attribute.
 * @param attribute either shutdownDate or startDate
 * @param nCat
 * @returns {Promise<void>}
 */
async function colorNodesByDate(attribute, nCat = 10) {
    const dates = [];
    model.nodeDataArray.forEach(node => {
        const d = Date.parse(node[attribute]);
        if (!isNaN(d)) {
            dates.push(d);
        }
    })
    const diff = Math.max.apply(null, dates) - Math.min.apply(null, dates)
    const binSize = diff / nCat;
    const nodes = {};
    model.nodeDataArray.forEach(node => {
        const cat = Math.round(Date.parse(node[attribute]) / binSize);
        if (nodes[cat]) {
            nodes[cat].push(node)
        } else {
            nodes[cat] = [node]
        }
    })
    await colorCategorizedNodeMap(nodes, true)
}

async function colorCategorizedNodeMap(nodes, grad = false) {
    let url;
    const n = Object.keys(nodes).length;
    if (grad) {
        url = "color/grad?a=ff0022&b=ffffff&n=";
    } else {
        url = "color?n=";
    }
    const res = await fetch(url + n);
    const colors = await res.json();
    Object.keys(nodes).forEach((key, i) => {
        colorAllNodes(nodes[key], colors[i]);
    })
}


function readColorMetaDataField() {
    return document.getElementById("color-attribute").value;
}


function settingFromSideBar() {
    const setting = readSettingProperties();
    applySetting(setting);
}

function applySetting(setting) {
    settingAppNodes(setting);
}

function settingAppNodes(setting) {
    var settingProperty = Object.keys(setting);
    settingProperty.forEach(property => {
        model.nodeDataArray.forEach(node => {
                if (node.category === property) {
                    console.log(node)
                    addColorToNode(node, setting[property]);
                }
            }
        )
    })
}

function applyColorWhenNodeCreated(node) {
    if (settings.length != 0) {
        var settingProperty = Object.keys(settings[0]);
        settingProperty.forEach(property => {
            if (property === node.category) {
                addColorToNode(node, settings[0][property]);
            } else {
            }
        });
    } else {
    }
}

/* Color Nodes by distance */

function getSelectedNode() {
    let node;
    diagram.selection.each(n => {
        node = n;
    })
    return node;
}


function colorNodesInSetObject(obj, color) {
    Object.keys(obj).forEach(key => {
        obj[key].forEach(node => {
            console.log("Node")
            console.log(node.sb.name)
            console.log('color')
            console.log(color[Number(key)])
            console.log(color)
            addColorToNode(node.sb, color[color.length - Number(key)])
        })
    })
}

function getMaxKey(obj) {
    let max = 2;

    for (let i = 0; i < Object.keys(obj).length; i++) {
        if (Object.keys(obj)[i] > max) {
            max = Object.keys(obj)[i]
        }
    }
    return max;
}

async function colorNodesByDistance() {
    const node = getSelectedNode()
    removeColorFromAllNodes()
    const childs = {};
    const parents = {};
    addAndTraverseChilds(childs, node, 0);
    addAndTraverseParents(parents, node, 0);
    const n_child_gen = getMaxKey(childs)
    const n_parent_gen = getMaxKey(parents)
    console.log(childs)
    console.log(n_child_gen)
    const res = await fetch('color/grad?n=' + String(n_child_gen + 1) + "&a=FFFFFF&b=ED553B");
    const pcolor = await res.json();
    const res2 = await fetch('color/grad?n=' + String(n_parent_gen + 1) + "&a=FFFFFF&b=3bd3ed");
    const ccolor = await res2.json()
    colorNodesInSetObject(childs, ccolor);
    colorNodesInSetObject(parents, pcolor);
}

function addAndTraverseChilds(dataObj, node, distance) {
    if (dataObj[distance]) {
        dataObj[distance].add(node);
    } else {
        dataObj[distance] = new Set().add(node)
    }
    const childs = getAllChildNodes(node)
    if (childs.size > 0) {
        childs.forEach(child => {
            if (!isInAnySet(child, dataObj)) {
                addAndTraverseChilds(dataObj, child, distance + 1)
            }
        })
    }
}


function addAndTraverseParents(dataObj, node, distance) {
    if (dataObj[distance]) {
        dataObj[distance].add(node);
    } else {
        dataObj[distance] = new Set().add(node)
    }
    const parents = getAllParentNodes(node)
    if (parents.size > 0) {
        parents.forEach(parent => {
            if (!isInAnySet(parent, dataObj)) {
                addAndTraverseParents(dataObj, parent, distance + 1)
            }

        })
    }
}

/**
 * Returns a Set of all child nodes of a node.
 * @param node
 * @returns {Set<go.Node>}
 */
function getAllChildNodes(node) {
    const childs = new Set();
    model.linkDataArray.forEach(link => {
        if (link.from === node.key) {
            childs.add(diagram.findNodeForKey(link.to))
        }
    })
    return childs;
}

/**
 * Returns a Set of all child nodes of a node.
 * @param node
 * @returns {Set<go.Node>}
 */
function getAllParentNodes(node) {
    const parents = new Set();
    model.linkDataArray.forEach(link => {
        if (link.to === node.key) {
            parents.add(diagram.findNodeForKey(link.from))
        }
    })
    return parents;
}

/**
 * Checks id parent is in any set of the dataObj. dataObj must be an object with only sets as values.
 * @param parent
 * @param dataObj
 * @returns {boolean}
 */
function isInAnySet(parent, dataObj) {
    const keys = Object.keys(dataObj);
    for (let i = 0; i < keys.length; i++) {
        if (dataObj[keys[i]].has(parent)) {
            return true;
        }
    }
    return false;
}
