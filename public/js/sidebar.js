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
 * Generates the HTML information.
 * @param {go.Part} part Is the input part for which the information should be generated.
 * @return {HTMLElement} Returns the appended infoContainer.
 */
function generateInfo(part, selectableAttributes) {
    const infoContainer = document.getElementById("infoContainer");

    deleteHtmlChilds(infoContainer);

    for (const attribute of selectableAttributes.keys()) {
        const attributeValue = part.data[attribute];
        let div;

        if(attribute === "desc") {
            div = generateInfoRow(attribute, attributeValue, true, selectableAttributes)
        } else {
            div = generateInfoRow(attribute, attributeValue, false, selectableAttributes);
        }
        infoContainer.appendChild(div);
    }
    return infoContainer;

}


/**
 * Generates one row of node information.
 * @param {String} attribute Is a node attribute like name, desc, license, ...
 * @param value Is a string or if there are multiple values then it is an array.
 * @param {boolean} setTextVertical If this parameter is checked, the css class "box-row" is removed from the div and the
 * content fo the div is displayed vertically.
 * @param selectableAttributes is the nodeSelectableAttributes or linkSelectableAttributes array.
 * @return {HTMLDivElement}
 */
function generateInfoRow(attribute, value, setTextVertical = false, selectableAttributes) {
    let div = document.createElement("div");
    let pAttribute = document.createElement("p");
    let pValue = document.createElement("p");

    if(!setTextVertical) {
        div.setAttribute("class", "box-row");
    }
    pAttribute.setAttribute("class", "node-info-text bold-text");
    pValue.setAttribute("class", "node-info-text");

    pAttribute.innerHTML = selectableAttributes.get(attribute) + ":";

    if(attribute == "from" || attribute == "to") {
        value = getNodeNameById(value);
    }

    // If a value is an array.
    if (typeof value === typeof []) {
        pValue.innerHTML = value.join(", ");
    } else {
        pValue.innerHTML = value;
    }

    div.appendChild(pAttribute);
    div.appendChild(pValue);

    return div;
}



function generateSidebarHeadline(headline) {
    let h2 = document.querySelector(".sidebar-box-resizable").querySelector("h2");
    h2.innerHTML = headline;
}


/**
 * Returns the name of a node from the nodeDataArray
 * @param id Id of a node
 * @return {String} Name of a node
 */
function getNodeNameById(id) {
    const nodeArray = model.nodeDataArray.filter(node => {
        return node.key == id;
    });
    return nodeArray[0].name;
}

