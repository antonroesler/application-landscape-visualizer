function init() {
  var $ = go.GraphObject.make;
  myDiagram = $(go.Diagram, "myDia");
  var nodeDataArray = [{
      key: "Peter"
    },
    {
      key: "Fridel"
    }
  ];
  var linkDataArray = [{
    to: "Peter",
    from: "Fridel"
  }];
  myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
  console.log("Done")
}
