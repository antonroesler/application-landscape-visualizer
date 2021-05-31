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
function addColorSetting(node, color) {
    diagram.model.commit(function (m) {
        m.set(node, "color", color)
    }, "add setting");
}

function settingFromSideBar() {
    const setting = readSettingProperties();
    applySetting(setting);
}

function applySetting(setting) {
    settingAppNodes(setting);
}

function settingAppNodes(setting) {
    var settingProperty = Object.keys(setting);
    settingProperty.forEach(property => {
        model.nodeDataArray.forEach(node => {
            if (node.category === property) {
                addColorSetting(node, setting[property]);
            }
        }
        )
    })
}

function applyColorWhenNodeCreated(node) {
    if (settings.length != 0) {
        var settingProperty = Object.keys(settings[0]);
        settingProperty.forEach(property => {
            if (property === node.category) {
                addColorSetting(node, settings[0][property]);
            } else {
            }
        });
    } else {
    }
}