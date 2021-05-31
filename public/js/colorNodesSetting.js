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
 * Contains all functions that create, update or delete parts of the gojs diagram. Especially the node and link data
 * array.
 *
 * @author Feng Yi Lu
 */

/**
 * Adds a stroke to a node.
 * @param node
 * @param color Color of the stroke (default is red)
 * @param width Width of the stroke (default is 3)
 */
function addStroke(node, color) {
    diagram.model.commit(function (m) {
        m.set(node, "color", color)
    }, "add stroke");
}

function addStrokeToAll(nodes, color = "red") {
    nodes.forEach(node => {
        addStroke(node, color, width);
    })
}

function settingFromSideBar() {
    const setting = readSettingProperties();
    applySetting(setting);
}

function applySetting(setting) {
    createSettingArray(setting);
    settingAppNodes(setting);
}

function createSettingArray(setting) {
    const settingSection = model.nodeDataArray.filter(function (currentElement) {
        for (let key in filter.properties) {
            if (currentElement[key.toString()] === undefined || currentElement[key] != filter.properties[key]) {
                return false;
            }
        }
        return true;
    });
    if (filterNodeArray.length === 0) {
        window.alert("there are no Nodes with this setting");
        return null;
    } else {
        diagram.startTransaction();
        model.nodeDataArray = filterNodeArray;
        diagram.commitTransaction("filter node applied");
        return filterNodeArray;
    }

}
