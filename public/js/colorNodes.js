/*
* Copyright (c) 2021 Ecore. All rights reserved.
*
* University:        Frankfurt University of Applied Sciences
* Study program:     Engineering Business Information Systems
* Module:            Advanced Programming 2021
* Professor:         Prof. Dr. Jung, Prof. Dr. Bremm
* Date:              10.07.2021
*
*/

/**
 * Contains all functions to color nodes.
 *
 * @author Feng Yi Lu, Anton Roesler
 */
const settings = [];

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
    } else if (dataField === 'parent-child') {
        colorChildsAndParents()
    } else
        colorAllNodesByAttribute(dataField)
}

/**
 * Reads value from visualize dropdown menu.
 * @returns String
 */
function readColorMetaDataField() {
    return document.getElementById("color-attribute").value;
}

/* Functions that actually apply the color node nodes */
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
    removeLegend()
}

/* Color nodes by a value of an attribute */
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

/* Color nodes by date attribute (in a gradient) */
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

/**
 * Fetches and applies a color map with n colors where n is the length of the nodes array.
 * @param nodes HashMap of array of nodes {x: [node1, node2...], y: [node8, node9,...]} al nodes in on array will have
 * the same color
 * @param grad If set to true a color gradient from red to white will be applied.
 * @returns {Promise<void>}
 */
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
    if (!grad){
        makeLegend(Object.keys(nodes), colors);
    } else {
        removeLegend()
    }
}




/* Color child and parent nodes */
/**
 * Wrapper function for _colorChildsAndParents.
 */
function colorChildsAndParents() {
    const node = getSelectedNode();
    if (node instanceof go.Node) {
        _colorChildsAndParents(node)
        createToast('Parent and child nodes of ' + node.sb.name + ' are visualized.', 'success')
    } else {
        createToast("Exactly one Application must be selected", 'fail')
    }
}

/**
 * Colors nodes in a way that shows all child and parent nodes in different colors. Requires a node to be selected.
 */
function _colorChildsAndParents(node) {
    removeColorFromAllNodes()
    const childs = new Set();
    getAllChildNodes(node, childs)
    childs.forEach(n => {
        addColorToNode(n, '#8ac926')
    })
    const parents = new Set();
    getAllParentNodes(node, parents)
    parents.forEach(n => {
        if (n.color !== 'transparent') {
            addColorToNode(n, '#1982c4')
        } else {
            addColorToNode(n, '#ff595e')
        }
    })
    addColorToNode(node.sb, '#ffca3a')
    makeLegend(["Child", "Parent", "Both", "Selected"], ["#8ac926","#ff595e","#1982c4", '#ffca3a'])
}


/**
 * Returns the selected node.
 * @returns {go.Node}
 */
function getSelectedNode() {
    let node;
    diagram.selection.each(n => { // This is not a good solution. Maybe we can find something better here.
        node = n;
    })
    return node;
}

/**
 * Returns a Set of all direct child nodes of a node.
 * @param node
 * @returns {Set<go.Node>}
 */
function getAllDirectChildNodes(node) {
    const childs = new Set();
    model.linkDataArray.forEach(link => {
        if (link.from === node.key) {
            childs.add(diagram.findNodeForKey(link.to).sb)
        }
    })
    return childs;
}

/**
 * Returns a Set of all direct parent nodes of a node.
 * @param node
 * @returns {Set<go.Node>}
 */
function getAllDirectParentNodes(node) {
    const parents = new Set();
    model.linkDataArray.forEach(link => {
        if (link.to === node.key) {
            parents.add(diagram.findNodeForKey(link.from).sb)
        }
    })
    return parents;
}

/**
 * Returns a Set of all parent nodes of a node. Here a parent is any node from that it's possible to reach the given
 * node. No matter how far away it is.
 * @param node
 * @param parents A Set
 */
function getAllParentNodes(node, parents) {
    let setBasedOnMode;
    if (parentChildFeatureOn === true) { 
        setBasedOnMode = getNodesFromKeys(findParentsOfANode(node));
    } else {
        setBasedOnMode = getAllDirectParentNodes(node);
    }
    setBasedOnMode.forEach(parent => {
        if (!parents.has(parent)) {
            parents.add(parent);
            getAllParentNodes(parent, parents);
        }

    })
}

/**
 * Returns a Set of all child nodes of a node. Here a child is any node that is reachable from the given node. No matter
 * how far away it is.
 * @param node
 * @param childs A Set
 */
function getAllChildNodes(node, childs) {
    let setBasedOnMode;
    if (parentChildFeatureOn === true) {
        setBasedOnMode = getNodesFromKeys(findChildsofANode(node));
    } else {
        setBasedOnMode = getAllDirectChildNodes(node);
    }
    setBasedOnMode.forEach(child => {
        if (!childs.has(child)) {
            childs.add(child);
            getAllChildNodes(child, childs);
        }
    })
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

/* Functions to render legend */

/**
 * Adds an element to the color legend in the coloring tab
 * @param label_text The text next to the color
 * @param color the color
 */
function addLegendElement(label_text, color){
    const legend = document.getElementById('legend');
    const row = document.createElement('div');
    const circle = document.createElement('div');
    const label = document.createElement('div');
    label.innerHTML = label_text;
    label.classList.add("legend-label");
    circle.classList.add('legend-color-dot');
    row.classList.add('legend-row');
    circle.style.backgroundColor = color;
    row.appendChild(circle);
    row.appendChild(label)
    legend.appendChild(row);
}

/**
 * Function to create a legend from to array where label[i] is the label for color[i].
 * @param labels String Array.
 * @param colors Array of colors.
 */
function makeLegend(labels, colors){
    removeLegend()
    for (let i = 0; i < labels.length; i++) {
        addLegendElement(labels[i], colors[i]);
    }
}

/**
 * Empties the legend.
 */
function removeLegend(){
    document.getElementById('legend').innerHTML = '';
}


/* Approach to color nodes in a gradient by distance from the selected node - NOT in use yet TODO: Implement or delete.*/

function colorNodesInSetObject(obj, color) {
    Object.keys(obj).forEach(key => {
        obj[key].forEach(node => {
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
    const childs = getAllDirectChildNodes(node)
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
    const parents = getAllDirectParentNodes(node)
    if (parents.size > 0) {
        parents.forEach(parent => {
            if (!isInAnySet(parent, dataObj)) {
                addAndTraverseParents(dataObj, parent, distance + 1)
            }

        })
    }
}

/**
 * Function used to color a new created node when a color setting is active.
 * @param node
 */
function applyColorWhenNodeCreated(node) {
    if (settings.length != 0) {
        var settingProperty = Object.keys(settings[0]);
        settingProperty.forEach(property => {
            if (property === node.category) {
                addColorToNode(node, settings[0][property]);
            } else {
            }
        });
    } 
}