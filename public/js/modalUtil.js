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
 * This file contains functions which bring functionality to the modals.
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
function openLinkLayoutModal() {
    document.getElementById("linkLayoutModal").style.display = "flex";
}

function openCreateNodeModal() {
    loadDropdownMenusForCreateNodeModal();
    document.getElementById("createNodeModal").style.display = "flex";
}

function openExportModal() {
    document.getElementById("exportModal").style.display = "flex";
}

function openEditLinkModal() {
    document.getElementById("linkModal").style.display = "flex";
}

function openEditNodeModal() {
    openCreateNodeModal();
    fillNodeDataIntoCreateNodeModal();
    changeCreateNodeModaltoEditNodeModal();
}

function openSettingsModal() {
    loadSettingsIntoModal();
    document.getElementById("settingsModal").style.display = "flex";
}

/**
 * Closes all modals which are displayed.
 */
function closeModal() {
    /* Get all modals */
    const modals = document.querySelectorAll(".modal-bg");

    /* Check if modal is active and deactivate it */
    for (let modal of modals) {
        if (modal.style.display === "flex") {
            modal.style.display = "none";
            resetFirstFormAfterHTMLTag(modal);
        }
    }
    resetTags();
}

/**
 * Resets the first form which occurs as child of the given HTML-Tag.
 * @param htmlTag
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
        for (i; i >= 0; i--) {
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

    for (const dataList of dataLists) {
        const length = dataList.options.length;
        for (let i = length - 1; i >= 0; i--) {
            dataList.children[i].remove();
        }
    }
}

/**
 * Adds attributes from nodes in diagram to fitting dropdown menu in modal.
 * @param {String} inputId String to identify the right input field.
 * @param {String} nodeAttribute It is a noe attribute like name, desc, license, ...
 */
function addDropdownMenuOptions(inputId, nodeAttribute) {
    const inputTag = document.getElementById(inputId);
    const listId = inputTag.getAttribute("list");
    const autoDropdown = document.getElementById(listId);
    const values = getAllValuesForOneNodeAttribute(nodeAttribute)

    // Create a new html option for every value in the set.
    values.forEach(function (value) {
        const el = document.createElement("option");
        el.value = value;
        autoDropdown.appendChild(el)
    })
}


/**
 *
 * Helper function to get correct input field from chips.
 * Sets an list attribute for the input field of chips, because they have a div container around their input field.
 * @param {String} parentId ID of the parent element. In the case of chips it is a div.
 * @return {string} Returns the id of the correct input field.
 */
function setListAttributeForInput(parentId) {
    const parent = document.getElementById(parentId);
    const input = parent.firstChild;
    input.setAttribute("list", `${parentId}Dropdown`)

    return input.getAttribute("id");
}


/**

 * adds a " " to each string between tag and department 
 */
 function addSpaceToTagsDepartments(data) {
    var tags = [];
    var departments = [];
    data.tags.forEach(tag => {
        tags.push(" " + tag);
    })
    data.departments.forEach(department => {
        departments.push(" " + department);
    })
    data.tags = tags;
    data.departments = departments;
    return data;
 }
/**
 * Get selected Node and extract the data to fill out the createNodeModal.
 */
function fillNodeDataIntoCreateNodeModal() {
    const goJsElement = getSelectedGoJsElement();
    const node = goJsElement.sb;
    const chipElementTags = M.Chips.getInstance(document.getElementById("inputTags"));
    const chipElementDepartments = M.Chips.getInstance(document.getElementById("inputDepartments"));

    document.getElementById("inputName").value = node.name;
    document.getElementById("inputCategory").value = node.category;
    document.getElementById("inputDescription").value = node.desc;
    pushChipDataToChipElement(chipElementTags, ArrayValueToChipJasonValues(node.tags));
    pushChipDataToChipElement(chipElementDepartments, ArrayValueToChipJasonValues(node.departments));
    document.getElementById("inputVersion").value  = node.version;
    document.getElementById("inputLicense").value = node.license;
    document.getElementById("inputProfessionalOwner").value = node.profOwner;
    document.getElementById("inputTechnicalOwner").value = node.techOwner;
    document.getElementById("inputStartDate").value = node.startDate;
    document.getElementById("inputShutdownDate").value = node.shutdownDate;
}

/**
 * Function to change the style and functions of the button to reuse the html of the createNodeModal
 */
function changeCreateNodeModaltoEditNodeModal() {
    const createNodeModal = document.querySelector("#createNodeModal");
    const headline = createNodeModal.querySelector("h2");
    const form = createNodeModal.querySelector("form");
    const btn = createNodeModal.querySelector(".modal-btn");
    const btnCancel = createNodeModal.querySelector(".modal-btn-cancel");
    const cancel = createNodeModal.querySelector(".modal-close");

    headline.innerHTML = "Edit Application."
    btn.innerHTML = "Save"
    btnCancel.onclick = function() { changeEditNodeModalToCreateNodeModal(); closeModal(); };
    cancel.onclick = function() { changeEditNodeModalToCreateNodeModal(); closeModal(); };
    form.onsubmit = function() {
        deleteDropdownMenuOptions();
        overwriteSelectedNode()
        closeModal();
        changeEditNodeModalToCreateNodeModal();
        return false;
    }
}


/**
 * Reset editNodeModal to CreateNodeModal
 */
function changeEditNodeModalToCreateNodeModal() {
    const createNodeModal = document.querySelector("#createNodeModal");
    const headline = createNodeModal.querySelector("h2");
    const form = createNodeModal.querySelector("form");
    const btn = createNodeModal.querySelector(".modal-btn");
    const btnCancel = createNodeModal.querySelector(".modal-btn-cancel");
    const cancel = createNodeModal.querySelector(".modal-close");

    headline.innerHTML = "Create Application."
    btn.innerHTML = "Create"
    btnCancel.onclick = function() { closeModal(); };
    cancel.onclick = function() { closeModal(); };
    form.onsubmit = function() {
        deleteDropdownMenuOptions();
        addAppNode();
        closeModal();
        return false
    }
}