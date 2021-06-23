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
 * Contains functions that calculate statistical data on the diagram that is used for the "Statistical Key Figure" Tab.
 * @author Anton Roesler
 */

/* Total number of Nodes / Links*/
/**
 * Returns the number of nodes in the NodeDataArray
 * @returns {number} of Nodes
 */
function totalNumberOfNodes() {
    return totalNumberOf('nodes')
}

/**
 * Returns the number of nodes in the LinkDataArray
 * @returns {number} of Links
 */
function totalNumberOfLinks() {
    return totalNumberOf('links')
}

/**
 * Returns the total number of nodes or links.
 * @param part 'nodes' or 'links'
 * @returns {number}
 */
function totalNumberOf(part) {
    try {
        if (part.toLowerCase().startsWith('link')) {
            return model.linkDataArray.length
        } else {
            return model.nodeDataArray.length
        }
    } catch (e) {
        createToast(part + "DataArray is missing", 'fail')
        return 0;
    }
}

/* Average number of children / parents*/

/**
 * Returns avg number of child nodes.
 * @returns {*}
 */
function avgNumberOfChildren() {
    return _avgNumberOf(numberOfChildNodes)
}

/**
 * Returns avg number of parent nodes
 * @returns {*}
 */
function avgNumberOfParents() {
    return _avgNumberOf(numberOfParentNodes)
}

/**
 * Returns average of all nodes for a function that returns a numeric value for each node.
 * @param getter e.g. numberOfParentNodes
 * @returns {*}
 * @private
 */
function _avgNumberOf(getter) {
    const numbers = [];
    model.nodeDataArray.forEach(node => {
        numbers.push(getter(node))
    })
    return meanOfArray(numbers);
}

function meanOfArray(arr) {
    return arr.reduce(function (sum, a) {
        return sum + a
    }, 0) / (arr.length || 1);
}


/* Average number of inputs */

/*
One might think this is the same as number of children/parents but there is one exception as a node that has two links
to the same child node has only one child but two outputs and vice versa for the parent
*/

/**
 * Returns avg number of inputs and outputs of all nodes in the diagram. The number is the same for in and outputs as
 * each input is the output of another node.
 * @returns {number}
 */
function avgNumberOfInputsOutputs() {
    return (model.linkDataArray.length / model.nodeDataArray.length)
}

/* Number of totally separated graphs */
/**
 * Returns the number of totally separated Graphs in the diagram.
 * @returns {number}
 */
function numberOfSeparateGraphs() {
    const allNodes = new Set();
    let nOfGraphs = 0;
    for (let i = 0; i < model.nodeDataArray.length; i++) {
        const node = model.nodeDataArray[i];
        if (!allNodes.has(node)) {
            nOfGraphs++;
            addNodeAndAllLinkedNodes(node, allNodes);
        }
        if (allNodes.size === model.nodeDataArray.length) {
            break;
        }
    }
    return nOfGraphs;
}

/**
 * Traverses the full network of parents/children from a given node and adds all nodes to the given allNodes set.
 * @param node a go.Node object
 * @param allNodes a Set
 */
function addNodeAndAllLinkedNodes(node, allNodes) {
    if (!allNodes.has(node)) {
        allNodes.add(node);
        getAllReachableNodes(node).forEach(neighbor => {
            addNodeAndAllLinkedNodes(neighbor, allNodes)
        })
    }
}

/**
 * Returns a set of all direct parents and children of a node.
 * @param node a go.Node object
 * @returns {Set<go.Node>} Set of go.Nodes objects
 */
function getAllReachableNodes(node) {
    const neighbors = new Set()
    getAllChildNodes(node, neighbors);
    getAllParentNodes(node, neighbors);
    return neighbors;
}