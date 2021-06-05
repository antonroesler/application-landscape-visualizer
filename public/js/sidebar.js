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
 * This script contains functions which are used to generate elements in the sidebar.
 *
 * @author Leonard Husske
 */

/**
 * Generates the HTML node information.
 * @param {go.Node}node Is the input node for which the node information should be generated.
 * @return {HTMLElement} Returns the appended nodeInfoContainer.
 */
function generateNodeInfo(node) {
    const nodeInfoContainer = document.getElementById("nodeInfoContainer");

    deleteHtmlChilds(nodeInfoContainer);

    for (const nodeAttribute of nodeSelectableAttributes.keys()) {
        const nodeValue = node.data[nodeAttribute];
        let div;

        if(nodeAttribute === "desc") {
            console.log(nodeAttribute);
            div = generateNodeInfoRow(nodeAttribute, nodeValue, true)
        } else {
            div = generateNodeInfoRow(nodeAttribute, nodeValue, false);
        }
        nodeInfoContainer.appendChild(div);
    }
    return nodeInfoContainer;
}

/**
 * Generates one row of node information.
 * @param {String} nodeAttribute Is a node attribute like name, desc, license, ...
 * @param nodeValue Is a string or if there are multiple values then it is an array.
 * @param {boolean} setVertical If this parameter is checked, the css class "box-row" is removed from the div and the
 * content fo the div is displayed vertically.
 * @return {HTMLDivElement}
 */
function generateNodeInfoRow(nodeAttribute, nodeValue, setVertical = false) {
    let div = document.createElement("div");
    let pNodeAttribute = document.createElement("p");
    let pNodeValue = document.createElement("p");

    if(!setVertical) {
        div.setAttribute("class", "box-row");
    }
    pNodeAttribute.setAttribute("class", "node-info-text bold-text");
    pNodeValue.setAttribute("class", "node-info-text");

    pNodeAttribute.innerHTML = nodeSelectableAttributes.get(nodeAttribute) + ":";

    // If a nodeValue has more than one value it is of type object (array).
    if(typeof nodeValue === typeof []) {
        pNodeValue.innerHTML = nodeValue.join(", ");
    }else {
        pNodeValue.innerHTML = nodeValue;
    }

    div.appendChild(pNodeAttribute);
    div.appendChild(pNodeValue);

    return div;
}

