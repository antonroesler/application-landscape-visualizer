/**
 * Loads a diagram from the database. The diagram must be specified by name.
 *
 */
async function loadDiagram() {
    diagram.startTransaction();
    model.nodeDataArray = [];
    model.linkDataArray = [];
    diagram.commitTransaction("empty array");
    const name = document.getElementById("loadCategory").value;
    const url = urljoin(URL, 'mongo/' + name);
    const res = await fetch(url);
    const loadDiagram = await res.json();
    loadDiagram.nodeDataArray.forEach(node => {
        addNodeToDiagram(node);
    });
    loadDiagram.linkDataArray.forEach(link => {
        addLinkToDiagram(link);
    });
}

/**
 * Saves the model
 * @returns {Promise<void>}
 */
async function saveDiagram() {
    const url = urljoin(URL, 'mongo');
    const params = {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            nodeDataArray: model.nodeDataArray,
            linkDataArray: model.linkDataArray,
            name: document.getElementById("saveName").value
        })
    };
    const res = await fetch(url, params);
    res.json().then(msg => console.log(msg))
}

/**
 * Loads all diagram names that exist in the database as an array.
 */
async function loadDiagramNames() {
    const url = urljoin(URL, 'mongo/diagram/names');
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