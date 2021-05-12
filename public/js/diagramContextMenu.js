/*
* Copyright (c) 2021 Ecore. All rights reserved.
*
* University:        Frankfurt University of Applied Sciences
* Study program:     Engineering Business Information Systems
* Module:            Advanced Programming 2021
* Professor:         Prof. Dr. Jung, Prof. Dr. Bremm
* Date:              12.05.2021
*
*/

/**
 * This file contains the contextMenu and its buttons for the diagram.
 * You need to specify a contextMenu especially for the diagram, that
 * means when you are not right clicking on a node ore link but on the
 * background.
 *
 * @author Leonard Hußke
 *
 */

/**
 * Opens the modal for adding a node.
 */
function openModal() {
    const url = window.location.href.split('#')[0] + "#createModal"
    location.href = url;
}


/**
 * contextMenu
 * Declaration of the contextMenu and its buttons
 */
var contextMenu =
    $("ContextMenu",
     /*   $("ContextMenuButton",
            $(go.TextBlock, "Undo"),
            { click: function(e, obj) { e.diagram.commandHandler.undo(); } },
            new go.Binding("visible", "", function(o) {
                return o.diagram.commandHandler.canUndo();
            }).ofObject()),
        $("ContextMenuButton",
            $(go.TextBlock, "Redo"),
            { click: function(e, obj) { e.diagram.commandHandler.redo(); } },
            new go.Binding("visible", "", function(o) {
                return o.diagram.commandHandler.canRedo();
            }).ofObject()),
*/
        // no binding, always visible button:
        $("ContextMenuButton",
            $(go.TextBlock, "Create Node"),
            { click: openModal })

    );
