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
 * @author Leonard Hußke , Feng Yi Lu, Anton Roesler, Benedikt Möller
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
 * - Force Directed
 * - Grid
 * - Circle
 * - Digraph
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
    if (layout == "cir") {
        diagram.linkTemplate = linkTemplateBezier;
    }else diagram.linkTemplate = linkTemplateAvoidsNodes;
    diagram.commitTransaction();
    
    diagram.startTransaction();
    diagram.linkTemplate.updateRoute();
    diagram.commitTransaction();
}


/*
Link Template
*/
function linkLayoutModalDialogHandler() {
    const linkLayout = document.getElementById("linkLayoutOptions").value
    appendLinkLayoutToDiagram(linkLayout)
    disableAutomaticLayout()
}
function appendLinkLayoutToDiagram(linkLayout) {
    const linkLayouts = {
        "avoids_nodes": linkTemplateAvoidsNodes,
        "normal": linkTemplateNormal,
        "bezier": linkTemplateBezier,
        "orthogonal": linkTemplateOrthogonal
    };
    lll = linkLayouts[linkLayout];
    console.log("hallo welt");
    console.log("des die nachricht" + lll);
    diagram.startTransaction();
    diagram.linkTemplate = linkLayouts[linkLayout];
    // diagram.linkTemplate.updateRoute();
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
