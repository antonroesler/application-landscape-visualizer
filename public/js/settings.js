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
 * File to save settings to the local storage of the browser and to apply settings.
 *
 * @author Leonard Husske
 */

function loadSettingsIntoModal() {
    const settings = loadSettings();

    for (const setting in settings) {
        document.getElementById(setting).checked = settings[setting];
    }
}

function loadSettings() {
    if(getSettingsFromLocalStorage() !== null) {
        return getSettingsFromLocalStorage();
    }else {
        return defaultSettings;
    }
}

function getSettingsFromLocalStorage() {
    const stringifiedSettings = window.localStorage.getItem("settings");
    return JSON.parse(stringifiedSettings);
}

function saveSettings() {
    const settings = getSettingsFromModal();
    saveSettingsToLocalStorage(settings);
}

function getSettingsFromModal() {
    const diagramHover = document.getElementById("checkboxDiagramHover").checked;
    const tutorial = document.getElementById("checkboxTutorial").checked;

    return {
        "checkboxDiagramHover" : diagramHover,
        "checkboxTutorial" : tutorial
    }
}

function saveSettingsToLocalStorage(settings) {
    window.localStorage.setItem('settings', JSON.stringify(settings));
}

function applySettings() {
    const settings = loadSettings();

    for (const settingsKey in settings) {
        switch (settingsKey) {
            case "checkboxDiagramHover":
                toggleTooltipSetting(settings[settingsKey]);
                break;
            case "checkboxTutorial":
                toggleTutorialSetting(settings[settingsKey]);
                break;
            default:
                break;
        }
    }
}

function toggleTooltipSetting(isActive) {
    if(isActive) {
        if(doTooltip !== null) {
            diagram.toolManager.doToolTip = doTooltip;
        }
    }
    else {
        doTooltip = diagram.toolManager.doToolTip;
        diagram.toolManager.doToolTip = function() {};
    }
}

function toggleTutorialSetting(isActive) {
    if(isActive) {
        document.getElementById("tutorial").style.display = "inline-block";
        toggleTutorial();
    } else {
        document.getElementById("tutorial").style.display = "none";
    }
}