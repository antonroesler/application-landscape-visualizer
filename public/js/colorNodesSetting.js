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
function removeColorFromNode(node){
    addColorToNode(node, "transparent")
}

/**
 * Colors all nodes in the given node array with the specified color.
 * @param nodeArray an array of nodes
 * @param color in any valid css format
 */
function colorAllNodes(nodeArray, color){
    nodeArray.forEach(node => {
        addColorToNode(node, color);
    })
}

/**
 * Removes color from all nodes in the nodeDataArray
 */
function removeColorFromAllNodes(){
    model.nodeDataArray.forEach(node => {
        removeColorFromNode(node);
    })
}

/**
 * Colors all nodes that have the same value for the same specified metadata filed in the same color.
 *
 * @param attributeName e.g. category, license, tag...
 */
async function colorAllNodesByAttribute(attributeName){
    const nodes = {};
    model.nodeDataArray.forEach(node => {
        if (nodes[node[attributeName]]) {
            nodes[node[attributeName]].push(node)
        } else {
            nodes[node[attributeName]] = [node]
        }
    })
    const n = Object.keys(nodes).length;
    const res = await fetch("color?n="+n);
    const colors = await res.json();
    Object.keys(nodes).forEach((key, i) => {
        colorAllNodes(nodes[key], colors[i]);
    })
}

function applyUserColorSetting(){
    const dataField = readColorMetaDataField()
    colorAllNodesByAttribute(dataField)
}

function readColorMetaDataField(){
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