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
 * Contains functions to highlight nodes in the diagram as well as functions to make a subset of nodes transparent.
 *
 * @author Anton Roesler
 */


/* ------- TRANSPARENCY ------- */


/**
 * Makes a node or a link transparent. The opacity can be defined, default is 0.2
 * @param obj The Node or Link
 * @param opacity Range 0.0 - 1.0
 */
function setOpacity(obj,opacity=0.15){
    diagram.model.commit(function (m){
        m.set(obj, "opacity", opacity)
        m.set(obj, "opacityText", opacity)
    }, "changed opacity");
}

/**
 * Sets all nodes to full opacity.
 */
function makeAllNodesFullOpacity(){
    model.nodeDataArray.forEach(node => {
        setOpacity(node, 1);
    })
}

/**
 * Checks if a link has a parent that does not have full opacity.
 *
 * @param link
 * @returns {boolean}
 */
function hasTransparentNode(link) {
    const from = model.findNodeDataForKey(link.from).opacity !== 1;
    const to = model.findNodeDataForKey(link.to).opacity !== 1;
    return from || to;
}

/**
 * Sets the Opacity of all Links. Only full opacity if both nodes have full opacity.
 */
function setLinkOpacity(){
    model.linkDataArray.forEach(link => {
        if (hasTransparentNode(link)){
            setOpacity(link, 0.15)
        } else {
            setOpacity(link, 1)
        }
    })
}

/* ------- STROKE - IS NOT USED FOR HIGHLIGHTING ANY LONGER - MAY BE REMOVED ------- */

/**
 * Adds stroke to all nodes in a given array.
 * @param nodes Array of nodes
 * @param color Color of the stroke (default is red)
 * @param width Width of the stroke (default is 3)
 */
function addStrokeToAll(nodes, color="red", width=3){
    nodes.forEach(node => {
        addStroke(node, color, width);
    })
}

/**
 * Removes stroke from all nodes in nodeDataArray.
 */
function removeStrokeFromAllNodesInDiagram(){
    model.nodeDataArray.forEach(node => {
        removeStroke(node)
    })
}

/**
 * Adds a stroke to a node.
 * @param node
 * @param color Color of the stroke (default is red)
 * @param width Width of the stroke (default is 3)
 */
function addStroke(node, color="red", width=3){
    diagram.model.commit(function (m){
        m.set(node, "stroke", color)
        m.set(node, "strokeWidth", width)
    }, "add stroke");
}

/**
 * Removes stroke from a node.
 * @param node
 */
function removeStroke(node){
    addStroke(node, undefined, 0)
}