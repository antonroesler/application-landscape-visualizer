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
 * Contains all functions that read or write html or css properties.
 *
 * @author Feng Yi Lu, Anton Roesler, Leonard Husske
 */

/**
 * Convert the values of a simple JSON object into an array
 */
function ChipJsonValuesToArray(json) {
    let valueArray = [];

    for (let i in json) {
        valueArray.push(json[i]["tag"]);
    }
    return valueArray;
}

function ArrayValueToChipJasonValues(array) {
    let chipData = [];
    for (const chipContent of array) {
        chipData.push({tag: chipContent});
    }
    return chipData
}

function pushChipDataToChipElement(chipElement, chipData) {
    for (const chipJson of chipData) {
        chipElement.addChip(chipJson);
    }
}



/**
 * Gets the input values from the user and calls the addNode() function to add
 * node to diagram.
 */
function readNodePropertiesFromModal() {
    const name = document.getElementById("inputName").value;
    const category = document.getElementById("inputCategory").value;
    const desc = document.getElementById("inputDescription").value;
    const tags = ChipJsonValuesToArray(M.Chips.getInstance(document.getElementById("inputTags")).chipsData);
    const departments = ChipJsonValuesToArray(M.Chips.getInstance(document.getElementById("inputDepartments")).chipsData);
    const version = document.getElementById("inputVersion").value;
    const license = document.getElementById("inputLicense").value;
    const profOwner = document.getElementById("inputProfessionalOwner").value;
    const techOwner = document.getElementById("inputTechnicalOwner").value;
    const startDate = document.getElementById("inputStartDate").value;
    const shutdownDate = document.getElementById("inputShutdownDate").value;

    return {
        name: name,
        category: category,
        desc: desc,
        tags: tags,
        version: version,
        departments: departments,
        license: license,
        profOwner: profOwner,
        techOwner: techOwner,
        startDate: startDate,
        shutdownDate: shutdownDate
    }
}

function readLinkPropertiesFromModal() {
    const type = document.getElementById("connectionTypeOptions").value;
    var dash;
    if (type === "Business Process") {
        dash = [5,5]
        // diagram.model.commit(function (m){ m.set(link, "dash", dash)},"changed Connection");
    }else {dash = [0,0]
        // diagram.model.commit(function (m){ m.set(link, "dash", dash)},"changed Connection");
    }
    return {
        type: type,
        dash: dash
    }
}


/**
 * Checks if the given name for the new node is already existing or not
 * @param {String} name
 * @return {boolean}
 */
function appNodeNameExists(name) {
    for (let i = 0; i < model.nodeDataArray.length; i++) {
        if (name === model.nodeDataArray[i].name) {
            return true;
        }
    }
    return false;
}


/**
 * Function gets all values for a specific node attribute from all nodes in
 * in the diagram (nodeDataArray)
 * @param {String} nodeAttribute Like name, desc, license, ...
 * @return {Set<String>} Values for the specific attribute.
 */
function getAllValuesForOneNodeAttribute(nodeAttribute) {
    const values = new Set([]);

    // Add every value of the specific node attribute to the set.
    for (const node of model.nodeDataArray) {

        // If value is an array, the values need to be extracted.
        if (Array.isArray(node[nodeAttribute])) {
            for (const value of node[nodeAttribute]) {
                values.add(value);
            }
        } else {
            values.add(node[nodeAttribute]);
        }
    }
    return values;
}


/**
 * Filter the nodeSelectableAttributes array, to exclude specific values.
 * @param {String[]}excludedNodeAttributes Node attributes like like name, desc, license, ...
 * @param {boolean} containsEmptySets Excludes attributes which does not contain any values in diagram.
 * @return {Map<string, string>} Returns a map like the NodeSelectableAttributes but without the excludes attributes.
 */
function filterNodeSelectableAttributes(excludedNodeAttributes, containsEmptySets = true) {
    let filteredNodeSelectableAttributes = new Map(nodeSelectableAttributes);

    for (let attributeKey of filteredNodeSelectableAttributes.keys()) {
        if (excludedNodeAttributes.includes(attributeKey)) {
            filteredNodeSelectableAttributes.delete(attributeKey);
        } else if (!containsEmptySets) {
            const nodeAttributeValues = getAllValuesForOneNodeAttribute(attributeKey);
            if (nodeAttributeValues.size === 0) {
                filteredNodeSelectableAttributes.delete(attributeKey);
            } else if (nodeAttributeValues.size === 1 && nodeAttributeValues.has("")) {
                filteredNodeSelectableAttributes.delete(attributeKey);
            }
        }
    }
    return filteredNodeSelectableAttributes;
}


/**
 * Generates a random number which imitates to be unique.
 * @return {number}
 */
function uniqueID() {
    return Math.floor(Math.random() * Date.now())
}

/**
 * This functions deletes all child elements of the given HTML element.
 * @param {HTMLElement} HTMLElement Is an HTML element from the html file.
 */
function deleteHtmlChilds(HTMLElement) {
    while (HTMLElement.childNodes.length > 1) {
        HTMLElement.removeChild(HTMLElement.lastChild);
    }
}

/**
 * Creates a toast which displays a message. the style of the toast can be chosen with the style parameter.
 * @param {String} message A String which is displayed in the toast.
 * @param {String} style Can be either: "success", "warning" or "fail"
 */
function createToast(message, style) {
    M.toast({html: message, classes: `toast-${style}`});
}


function hideHTMLElement(htmlElement) {
    htmlElement.style.display = "none";
}

function showHTMLElement(htmlElement, display="flex") {
    htmlElement.style.display = display;
}


function getSelectedGoJsElement() {
    const goJsElement = diagram.selection.first();
    return goJsElement;
}
