var $ = go.GraphObject.make;


function readAppName() {
  var textField = document.getElementById("a-name");
  appName = textField.value;
  var color = getColor();
  D.add(appName, color)
}

function addElementToOptionsList(name) {
  var optionsListDiv = document.getElementById("opt")
  let div = document.createElement('div')
  let checkbox = document.createElement('input')
  checkbox.setAttribute("type", "checkbox")
  checkbox.setAttribute("id", name)
  checkbox.setAttribute("name", name)
  let label = document.createElement('label')
  label.setAttribute("for", name)
  div.appendChild(checkbox)
  div.appendChild(label)
  optionsListDiv.appendChild(div)
  label.innerHTML += name;
}

function getCheckedElementsFromOptionsList(){
  var checkedKeys;
  checkedKeys = [];
  var optionsListDiv = document.getElementById("opt");
  var childern = optionsListDiv.getElementsByTagName('div');
  for (var i = 0; i < childern.length; i++){
    var div = childern[i];
    var label = div.getElementsByTagName('label')[0]
    var check = div.getElementsByTagName('input')[0]

    if (check.checked == true) {
      checkedKeys.push(label.innerHTML)
    }


  }
  return checkedKeys;
}

function makeLinkDataArray(from, toArray){
  var output = []
  for (var i = 0; i < toArray.length; i++){
    output.push({ 'from': from, 'to':toArray[i] })
  }
  return output;
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
    this.diagram.layout = $(go.CircularLayout);
  }

  add(name, color) {
    this.nodeDataArray.push({
      key: name,
      color: color
    })
    var deps = getCheckedElementsFromOptionsList()
    var links = makeLinkDataArray(name, deps)
    for (var i = 0; i < links.length; i++){
      this.linkDataArray.push(links[i])
    }
    this.diagram.startTransaction();
    this.diagram.updateAllRelationshipsFromData();
    this.diagram.updateAllTargetBindings();
    this.diagram.commitTransaction("update");
    addElementToOptionsList(name)

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

function getColor() {
  var col = document.getElementById('farbe').value
  if (isColor(col)){
    return col;
  }
  return 'white';
}

function color() {
  var col = document.getElementById('farbe').value
  if (isColor(col)){
  document.getElementById('farbe').style.backgroundColor = col;
  }
}

function isColor(strColor){
  if (strColor == ""){
    return false;
  }
  var s = new Option().style;
  s.color = strColor;
  return s.color == strColor;
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
