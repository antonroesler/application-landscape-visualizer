const $ = go.GraphObject.make;

const diagram = $(go.Diagram, "diagramDiv",
    { // enable Ctrl-Z to undo and Ctrl-Y to redo
        "undoManager.isEnabled": true
    });

const model = $(go.GraphLinksModel);

model.nodeDataArray = [ { key:"1", color:"blue" } ];
model.linkDataArray = [];

const defaultTemplate = $(go.Node, "Auto",
        $(go.Shape, "RoundedRectangle", {
            fill: "white"
        },
        new go.Binding("fill", "color")),
        $(go.TextBlock, "Text", {
            margin: 10
        },
        new go.Binding("text", "key"))
);

function init() {

    diagram.model = model;

    // default Node template
    diagram.nodeTemplate = defaultTemplate;

    diagram.layout = $(go.LayeredDigraphLayout);

}