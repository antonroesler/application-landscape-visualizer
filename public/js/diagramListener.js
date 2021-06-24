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
 * This script contains goJS diagramListeners.
 * DiagramListeners are events which occur if the user is interacting with the goJS diagram.
 * @author Leonard Husske , Feng Yi Lu, Anton Roesler, Christine Kaderka
 */

/**
 * Adds an diagramListener when an Object in the diagram is clicked.
 * If a node is clicked, the node information are generated.
 */
diagram.addDiagramListener("ObjectSingleClicked", function (e) {
    let part = e.subject.part;
    if (part instanceof go.Node) {
        generateSidebarHeadline("Application Information")
        generateInfo(part, nodeSelectableAttributes);
    }
    else if (part instanceof go.Link) {
        generateSidebarHeadline("Connection Information")
        generateInfo(part, linkSelectableAttributes);
    }
});


/**
 * Adds an diagramListener when the diagram background is clicked.
 * If the background is clicked, the node information in the sidebar are deleted.
 */
diagram.addDiagramListener("BackgroundSingleClicked", function (e) {
    const nodeInfoContainer = document.getElementById("infoContainer");
    deleteHtmlChilds(nodeInfoContainer);
    generateSidebarHeadline("Statistical Key Figures")
});


/**
 * Adds an diagramListener when a link is created.
 * 
 */
diagram.addDiagramListener("LinkDrawn", function (e) {
    if (appliedFilters.length > 0 || parentChildFeatureOn === true) {
        linkHandlerWhileFilterOn();
    }

});