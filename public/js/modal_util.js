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
 * Contains functions to open modals.
 *
 * @author Leonard Husske
 */

/*
 * Opens the saveDiagram modal.
 */
function openSaveDiagramModal() {
    document.getElementById("saveDiagramModal").style.display = "flex";
};

/*
 * Closes a modal.
 */
function closeModal() {
    document.querySelector(".modal-bg").style.display = "none";
    };