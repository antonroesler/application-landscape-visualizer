/*
* Copyright (c) 2021 Ecore. All rights reserved.
*
* University:        Frankfurt University of Applied Sciences
* Study program:     Engineering Business Information Systems
* Module:            Advanced Programming 2021
* Professor:         Prof. Dr. Jung, Prof. Dr. Bremm
* Date:              25.05.2021
*
*/

/**
 * This file contains functions to open and close modals.
 *
 * @author Leonard Husske
 */

function openSaveDiagramModal() {
    document.getElementById("saveDiagramModal").style.display = "flex";
}

function openLoadDiagramModal() {
    document.getElementById("loadDiagramModal").style.display = "flex";
}

function openLayoutModal() {
    document.getElementById("layoutModal").style.display = "flex";
}

function openCreateNodeModal() {
    loadDropdownMenusForCreateNodeModal();
    document.getElementById("createNodeModal").style.display = "flex";
}

/**
 * Closes all modals which are displayed.
 */
function closeModal() {
    /* Get all modals */
    const modals = document.querySelectorAll(".modal-bg");

    /* Check if modal is active and deactivate it */
    for (let modal of modals) {
        if(modal.style.display === "flex") {
            modal.style.display = "none";
            resetFirstFormAfterHTMLTag(modal);
        }
    }
    resetTags();
}

/**
 * Resets the first form which occurs as child of the given HTML-Tag.
 */
function resetFirstFormAfterHTMLTag(htmlTag) {
    htmlTag.getElementsByTagName('form')[0].reset();
}


/**
 * Delete all chips inside the chips div.
 */
function resetTags() {
    let elements = document.getElementsByClassName("chips");

    for (const element of elements) {
        instance = M.Chips.getInstance(element);

        // Chips need to be deleted from the end, because they would move up.
        let i = instance.chipsData.length - 1;
        for ( i; i >= 0; i--) {
            instance.deleteChip(i);
        }
    }
}

/**
 * Load all dropdown menus for createModal.
 */
function loadDropdownMenusForCreateNodeModal() {
    addDropdownMenuOptions("inputLicense", "license");
    addDropdownMenuOptions("inputVersion", "version");
    addDropdownMenuOptions("inputProfessionalOwner", "profOwner");
    addDropdownMenuOptions("inputTechnicalOwner", "techOwner");
    addDropdownMenuOptions(setListAttributeForInput("inputDepartments"), "departments");
    addDropdownMenuOptions(setListAttributeForInput("inputTags"), "tags");
}

/**
 * Delete dropdown menu options from all datalists.
 */
function deleteDropdownMenuOptions() {

    const dataLists = document.getElementsByTagName("datalist")
    console.log(dataLists)

    for (const dataList of dataLists) {
        const length = dataList.options.length;
        for (i = length - 1; i >= 0; i--) {
            dataList.children[i].remove();
        }
    }

}

/**
 * Adds attributes from nodes in diagram to fitting dropdown menu in modal.
 */
function addDropdownMenuOptions(id, nodeAttribute) {
    const inputTag = document.getElementById(id);
    const listId = inputTag.getAttribute("list");
    const autoDropdown = document.getElementById(listId);
    const values = getAllValuesForOneNodeAttribute(nodeAttribute)

    // Create a new html option for every value in the set.
    values.forEach(function(value) {
        const el = document.createElement("option");
        el.value = value;
        autoDropdown.appendChild(el)
    })
}

/**
 * Helper function to get correct input field from chips.
 */
function setListAttributeForInput(parentId) {
    const parent = document.getElementById(parentId);
    const input = parent.firstChild;
    input.setAttribute("list", `${parentId}Dropdown`)
    console.log(input);

    return input.getAttribute("id");
}