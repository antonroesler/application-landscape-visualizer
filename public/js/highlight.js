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

/* ------- STROKE ------- */

/**
 * Adds stroke to all nodes in a given array.
 * @param nodes Array of nodes
 * @param color Color of the stroke (default is red)
 * @param width Width of the stroke (default is 3)
 */
function addStrokeToAll(nodes, color="red", width=3){
    nodes.forEach(node => {
        addStroke(node.key, color, width);
    })
}

/**
 * Removes stroke from all nodes in nodeDataArray.
 */
function removeStrokeFromAllNodesInDiagram(){
    model.nodeDataArray.forEach(node => {
        removeStroke(node.key)
    })
}

/**
 * Adds a stroke to a node.
 * @param node_id The key of the node
 * @param color Color of the stroke (default is red)
 * @param width Width of the stroke (default is 3)
 */
function addStroke(node_id, color="red", width=3){
    const node = diagram.findNodeForKey(node_id);
    diagram.model.commit(function (m){
        m.set(node.data, "stroke", color)
        m.set(node.data, "strokeWidth", width)
    }, "add stroke");
}

/**
 * Removes stroke from a node.
 * @param node_id The key of the node
 */
function removeStroke(node_id){
    addStroke(node_id, undefined, 0)
}

