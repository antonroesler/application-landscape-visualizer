const $ = go.GraphObject.make;
const diagram = $(go.Diagram, "diagramDiv",
    { // enable Ctrl-Z to undo and Ctrl-Y to redo
        "undoManager.isEnabled": true
    });
const model = $(go.GraphLinksModel);
model.nodeDataArray = [{ key: "Component", category: "Component", desc: "metadata" }, { key: "Neo4J", color: "white", category: "Database", desc: "metadata" }, { key: "Application", category: "Package", desc: "metadata" }];
model.linkDataArray = [];


var databaseTemplate =
    $(go.Node, "Vertical",  // "vertical" determine the order of the go.objects 
        $(go.Shape, "Database", { height: 70, width: 70, fill: "blue" }, //per default color and size is setted, can be customised through e.g. "go.Binding()"
            new go.Binding("fill", "color")),
        $(go.TextBlock, { font: "bold 12pt sans-serif" },
            new go.Binding("text", "key")),
        $(go.TextBlock, "Description:"),
        $(go.TextBlock, new go.Binding("text", "desc")),

    );

var componentTemplate =
    $(go.Node, "Vertical",
        $(go.Shape, "Component", { height: 70, width: 70, fill: "red" },
            new go.Binding("fill", "color")),

        $(go.TextBlock, { font: "bold 12pt sans-serif" },
            new go.Binding("text", "key")),
        $(go.TextBlock, "Description:"),
        $(go.TextBlock, new go.Binding("text", "desc")),

    );

var packageTemplate =
    $(go.Node, "Vertical",
        $(go.Shape, "Package", { height: 70, width: 70, fill: "green" },
            new go.Binding("fill", "color")),

        $(go.TextBlock, { font: "bold 12pt sans-serif" },
            new go.Binding("text", "key")),
        $(go.TextBlock, "Description:"),
        $(go.TextBlock, new go.Binding("text", "desc")),

    );

// templmap includes all of our templates, we can get access to with "category" inside of an NodeObject. Name of the template is defined in templmap.add("name", variable of Template)
var templmap = new go.Map();
templmap.add("", diagram.nodeTemplate);
templmap.add("Database", databaseTemplate);
templmap.add("Component", componentTemplate)
templmap.add("Package", packageTemplate);


function init() {

    diagram.model = model;
    // passing our TemplateMap into our diagramS
    diagram.nodeTemplateMap = templmap;

    diagram.layout = $(go.LayeredDigraphLayout);

}

