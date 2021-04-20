function init() {
var $ = go.GraphObject.make;
myDiagram = $(go.Diagram, "myDiagramDiv");
//whole Array for the Nodes ist set here
var nodeDataArray = [
{ key: "Photoshop CS" , color: "cyan", group: "Creative Tools"},
{ key: "Dreamweaver CS" , color: "cyan", group: "Creative Tools"},
{ key: "DxO Camera Lab" , color: "lime", group: "Creative Tools"},
{ key: "Spring Boot" , color: "lime", group: "Development"},
{ key: "Eclipse IDE" , color: "cyan", group: "Development"},
{ key: "Visual Studio Code" , color: "cyan", group: "Development" },
{ key: "MS Office", color: "yellow", group: "Office"},
{ key: "Libre Office", color: "yellow", group: "Office"},
{ key: "Notepad ++", color: "yellow", group: "Office"},
{ key: "MS Project", color: "yellow", group: "Office"},
{ key: "Creative Tools", isGroup: true},
{ key: "Development", isGroup: true},
{ key: "Office", isGroup: true}
];
//Links and/or Connections between the Nodes set here
var linkDataArray = [
{ to: "Dreamweaver CS", from: "Photoshop CS" , color: "red"},
{ to: "Photoshop CS", from: "DxO Camera Lab" },
{ to: "Spring Boot", from: "Eclipse IDE"},
{ to: "Visual Studio Code", from: "Eclipse IDE"},
{ to: "Dreamweaver CS", from: "Photoshop CS"},
{ to: "Development", from: "Creative Tools"},
{ to: "Development", from: "Office"}
];

//This ist the visual Part to set the shape and colors
myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
myDiagram.nodeTemplate = $(go.Node, "Auto",
//Shape of the nodes ist set below
$(go.Shape, "RoundedRectangle",{fill: "white"},
//color ist set in the data array, the option "color" below is inherit
    new go.Binding("fill", "color")
    ),

    $(go.TextBlock, "Text",{margin: 12},
      new go.Binding("text", "key")
      )


);
//Arrow behaviour and Color is set here
myDiagram.linkTemplate =
  $(go.Link,
    $(go.Shape, {strokeWidth: 2},
        new go.Binding("stroke", "color")
    ),

  $(go.Shape, {toArrow: "Standard", stroke: null},
      new go.Binding("fill", "color")
    )
);

}
