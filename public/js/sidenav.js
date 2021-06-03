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
 * Contains all functions to load and extract data for the sidenav.
 *
 * @author Leonard Husske
 */

/**
 * This function generates the collapsible of the sidenav, which contains all the possible attributes to filter the
 * diagram and the suitable values.
 * @return {HTMLElement}
 */
function generateCollapsible() {

    const collapsible = document.getElementById("collapsible");
    const nodeSelectableAttributesFiltered = filterNodeSelectableAttributes(["name", "desc"], false);

    deleteHtmlChilds(collapsible);

    nodeSelectableAttributesFiltered.forEach((uiAttributeValue, nodeAttribute, map) => {

        const li = document.createElement("li");
        const hr = document.createElement("hr");
        const a = generateCollapsibleHeader(uiAttributeValue);
        const div = generateCollapsibleBody(nodeAttribute);

        hr.setAttribute("class", "hr-collapse");

        li.appendChild(a);
        li.appendChild(div);
        collapsible.appendChild(li);
        collapsible.appendChild(hr);
    })
    return collapsible;
}


/**
 * This function generates the header for a given node attribute which is filterable in the diagram.
 * @param {String}nodeAttribute Is a node attribute like name, desc, license, ...
 * @return {HTMLAnchorElement} Returns an a-tag with an i-tag inside.
 */
function generateCollapsibleHeader(nodeAttribute) {
    let a = document.createElement("a");
    let i = document.createElement("i");

    a.setAttribute("class", "collapsible-header");
    a.innerHTML = nodeAttribute;

    i.setAttribute("class", "material-icons");
    i.innerHTML = "arrow_drop_down";

    a.appendChild(i);

    return a;
}


/**
 *
 * @param {String} nodeAttribute Is a node attribute like name, desc, license, ...
 * @returns {HTMLDivElement}
 */
function generateCollapsibleBody(nodeAttribute) {

    const nodeAttributeValues = getAllValuesForOneNodeAttribute(nodeAttribute);
    let div = document.createElement("div");
    let ul = document.createElement("ul");

    div.setAttribute("class", "collapsible-body");

    div.appendChild(ul);

    for (let value of nodeAttributeValues) {
        if(value === undefined) {
            value = "Undefined";
        }
        let li = document.createElement("li");
        let label = document.createElement("label");
        let input = document.createElement("input");
        let id =  value.replace(/\s/g, "") + "_" + uniqueID();

        input.setAttribute("type", "checkbox");
        input.setAttribute("id", `${id}`);
        input.setAttribute("class", "checkbox-collapsible");
        input.setAttribute("value", nodeAttribute);
        label.setAttribute("for", `${id}`);

        label.appendChild(input);
        li.appendChild(label);
        ul.appendChild(li);

        input.insertAdjacentText("afterend", value);
    }
    return div;
}


/**
 *
 * @return {{name, properties: {}}} FilterObject which contains the name of the filter and all filterable attributes
 * and its values.
 */
function readFilterPropertiesFromSideNav() {
    const checkboxes = document.querySelectorAll(".checkbox-collapsible:checked");
    let filterObject = {
        name: document.getElementById("filterName").value,
        properties: {}
    };

    for (const checkbox of checkboxes) {
        const attributeKey = checkbox.getAttribute("value");

        if (attributeKey in filterObject.properties) {
            filterObject.properties[attributeKey].push(checkbox.nextSibling.textContent);
        } else {
            filterObject.properties[attributeKey] = [];
            filterObject.properties[attributeKey].push(checkbox.nextSibling.textContent);
        }
    }
    return filterObject;
}


/**
 * Function which generates the content of the sidenav, opens and closes the sidenav.
 */
function openSidenav() {
    if(!sidenav.isOpen) {
        generateCollapsible();
        sidenav.open();
    }
    else {
        document.getElementById("sidenavForm").reset();
        sidenav.close();
    }
}