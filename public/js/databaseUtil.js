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
 * @author Anton Roesler, Patrick Frech
 */

/**
 * Loads a diagram from the database. The diagram must be specified by name.
 *
 */
async function loadDiagram() {
    clearAllArraysFilterPC();
    removeLegend();
    diagram.startTransaction();
    model.nodeDataArray = [];
    model.linkDataArray = [];
    diagram.commitTransaction("empty array");
    const name = document.getElementById("loadCategory").value;
    const url = 'mongo/' + name;
    const res = await fetch(url);
    const loadDiagram = await res.json();
    loadDiagram.nodeDataArray.forEach(node => {
        addNodeToDiagram(node);
    });
    loadDiagram.linkDataArray.forEach(link => {
        addLinkToDiagram(link);
    });
    updateDiagramTitle(name)
    generateKeyFigureInfo()
}

/**
 * Saves model to the database.
 * @returns {Promise<void>}
 */
async function saveDiagramToMongo(diagramName) {
    const url = 'mongo';
    const params = {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            nodeDataArray: model.nodeDataArray,
            linkDataArray: model.linkDataArray,
            name: diagramName
        })
    };
    const res = await fetch(url, params);
    res.json().then(msg => console.log(msg))
}

function saveDiagram() {
    try {
        _saveDiagram().then(r => createToast("Diagram saved.", "success")).catch(error => createToast(error, "fail"));
    } catch (e) {
        console.log(e);
    }
}

/**
 * Starts user dialog to save/overwrite diagram.
 * @returns {Promise<void>}
 */
async function _saveDiagram() {
    const diagramName = document.getElementById("saveName").value;
    const x = await fetch('mongo/diagram/names');
    const names = await x.json();
    if (names.includes(diagramName)) {
        const r = confirm("A diagram with that name already exists. Do you want to overwrite it?");
        if (r === true) { // True if user wants to overwrite diagram.
            const delurl = urljoin("mongo", diagramName);
            await fetch(delurl, { method: 'DELETE' })
            await saveDiagramToMongo(diagramName)
        } else {
            throw "Saving canceled."
        }
    } else { // If name doesnt yet exists in DB, the diagram is simply saved.
        await saveDiagramToMongo(diagramName);
    }
}

/**
 * Loads all diagram names that exist in the database as an array.
 */
async function loadDiagramNames() {
    const url = 'mongo/diagram/names';
    const res = await fetch(url);
    res.json().then(diagrams => {
        let i;
        const select = document.getElementById("loadCategory");
        const length = select.options.length;
        for (i = length - 1; i >= 0; i--) {
            select.options[i] = null;
        }
        for (i = 0; i < diagrams.length; i++) {
            const opt = diagrams[i];
            const el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            select.appendChild(el);
        }
    });

}