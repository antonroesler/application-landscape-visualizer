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
    diagram.linkTemplate.updateRoute();
    diagram.commitTransaction();
}


/*
Set Link Attriutes for Layout
*/
function linkLayoutModalDialogHandler() {
    const route = document.getElementById("linkLayoutOptions").value
    
    if (route != "Bezier") {
        model.linkDataArray.forEach(link => {setRoute(link, routing=route, curve="None", curviness=0 );});
    } else {
        model.linkDataArray.forEach(link => {setRoute(link, routing="Normal", curve=route, curviness=40 );});
    }
}

function setRoute(link,routing,curve,curviness){
    diagram.model.commit(function (m){
        m.set(link, "routing", routing) 
        m.set(link, "curve", curve)
        m.set(link, "curviness", curviness)
    },"changed LinkLayout");
}

//Not longer needed if Binding Design is better -> DELETE after decision
// function appendLinkLayoutToDiagram(linkLayout) {
//     const linkLayouts = {
//         "avoids_nodes": linkTemplateAvoidsNodes,
//         "normal": linkTemplateNormal,
//         "bezier": linkTemplateBezier,
//         "orthogonal": linkTemplateOrthogonal
//     };
//     diagram.startTransaction();
//     diagram.linkTemplate = linkLayouts[linkLayout];
//     diagram.commitTransaction();
// }


/**
 * Disables the gojs behavior of automatically reorganizing the diagram's layout.
 */
function disableAutomaticLayout() {
    diagram.startTransaction()
    diagram.layout = initialLayout;
    diagram.commitTransaction()
}
