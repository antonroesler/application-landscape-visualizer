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
 * Contains all functions that are used to change the layout of the diagram.
 *
 * @author Leonard Hußke , Feng Yi Lu, Anton Roesler
 */


/**
 * Handles the layout when the Auto Layout Modal is used.
 */
function layoutModalDialogHandler() {
    const layout = document.getElementById("layoutOptions").value
    appendLayoutToDiagram(layout)
    disableAutomaticLayout()
}


/**
 * Automatically arranges the diagram according to a given layout.
 * Options are:
 * - Tree
 * - Grid
 * - Circle
 * - Diagraph
 */
function appendLayoutToDiagram(layout) {
    const layouts = {
        "tree": go.TreeLayout,
        "grid": go.GridLayout,
        "cir": go.CircularLayout,
        "laydi": go.LayeredDigraphLayout,
        "forcedir": go.ForceDirectedLayout,
    };
    diagram.startTransaction();
    diagram.layout = $(layouts[layout]);
    diagram.commitTransaction();
}


/**
 * Disables the gojs behavior of automatically reorganizing the diagram's layout.
 */
function disableAutomaticLayout() {
    diagram.startTransaction()
    diagram.layout = initialLayout;
    diagram.commitTransaction()
}
