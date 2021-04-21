var $ = go.GraphObject.make;


function readAppName() {
  var textField = document.getElementById("a-name");
  appName = textField.value;
  console.log(appName)
  D.add(appName, "lightblue")
}


class ApplicationDiagramm {
  constructor() {
    this.diagram = $(go.Diagram, "dia2");
    this.nodeDataArray = [];
    this.linkDataArray = [];
    this.diagram.model = new go.GraphLinksModel(this.nodeDataArray, this.linkDataArray);
    this.diagram.nodeTemplate =
      $(go.Node, "Auto",
        $(go.Shape, "RoundedRectangle", {
            fill: "white"
          },
          new go.Binding("fill", "color")),
        $(go.TextBlock, "Text", {
            margin: 10
          },
          new go.Binding("text", "key"))
      );
  }

  add(name, color) {
    this.nodeDataArray.push({
      key: name,
      color: color
    })
    this.diagram.startTransaction();
    this.diagram.updateAllRelationshipsFromData();
    this.diagram.updateAllTargetBindings();
    this.diagram.commitTransaction("update");
  }
}

var D = new ApplicationDiagramm();

function createApp(name) {
  sd = $(go.Diagram, "dia2");
  var nodeDataArray = [];
  var linkDataArray = [];
  sd.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);

  sd.nodeTemplate =
    $(go.Node, "Auto",
      $(go.Shape, "RoundedRectangle", {
          fill: "white"
        },
        new go.Binding("fill", "color")),
      $(go.TextBlock, "Text", {
          margin: 10
        },
        new go.Binding("text", "key"))
    );
}

function init() {
  myDiagram = $(go.Diagram, "myDia");
  var nodeDataArray = [{
      key: "Peter",
      color: "lime"
    },
    {
      key: "Fridel",
      color: "cyan"
    },
    {
      key: "Die Gang",
      isGroup: true
    },
    {
      key: "Günni",
      color: "pink",
      group: "Die Gang"
    },
    {
      key: "Alfred",
      color: "green",
      group: "Die Gang"
    }

  ];
  var linkDataArray = [{
      to: "Peter",
      from: "Fridel",
      color: "red"
    },
    {
      from: "Günni",
      to: "Alfred",
      color: "black"
    },
    {
      from: "Fridel",
      to: "Alfred",
      color: "Red"
    }

  ];
  myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);

  myDiagram.nodeTemplate =
    $(go.Node, "Auto",
      $(go.Shape, "RoundedRectangle", {
          fill: "white"
        },
        new go.Binding("fill", "color")),
      $(go.TextBlock, "Text", {
          margin: 10
        },
        new go.Binding("text", "key"))
    );

  myDiagram.linkTemplate =
    $(go.Link,
      $(go.Shape, {
          strokeWidth: 3
        },
        new go.Binding("stroke", "color")
      ),
      $(go.Shape, {
          toArrow: "Standard",
          stroke: null
        },
        new go.Binding("fill", "color"))
    );
  myDiagram.layout = $(go.CircularLayout);
}
