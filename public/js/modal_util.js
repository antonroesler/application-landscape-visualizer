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

/*
 * Closes all modals which are displayed.
 */
function closeModal() {
    /* Get all modals */
    const modals = document.querySelectorAll(".modal-bg");

    /* Check if modal is active and deactivate it */
    for (let modal of modals) {
        if(modal.style.display === "flex") {
            modal.style.display = "none";
        }
    }
}