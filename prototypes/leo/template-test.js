function init() {
  var $ = go.GraphObject.make;
  diagram = $(go.Diagram, "myDiagramDiv",
  {
    // allow double click in background to create a new node
    "clickCreatingTool.archetypeNodeData": { text: "Node", color: "white" },

    // enable undo & redo
    "undoManager.isEnabled": true
  });

var $ = go.GraphObject.make;

      // the node template describes how each Node should be constructed
      diagram.nodeTemplate =
        $(go.Node, "Auto",  // the Shape automatically fits around the TextBlock
          $(go.Shape, "RoundedRectangle",  // use this kind of figure for the Shape
            // bind Shape.fill to Node.data.color
            new go.Binding("fill", "color")),
          $(go.TextBlock,
            { margin: 3 },  // some room around the text
            // bind TextBlock.text to Node.data.key
            new go.Binding("text", "key"))
        );

        var simpletemplate =
            $(go.Node, "Auto",
              $(go.Shape, "Ellipse",
                new go.Binding("fill", "color")),
              $(go.TextBlock,
                new go.Binding("text", "key")),
              {
                toolTip:
                  $("ToolTip",
                    $(go.TextBlock, { margin: 4 },
                      new go.Binding("text", "desc"))
                  )
              }
            );

          // the "detailed" template shows all of the information in a Table Panel
          var detailtemplate =
            $(go.Node, "Auto",
              $(go.Shape, "RoundedRectangle",
                new go.Binding("fill", "color")),
              $(go.Panel, "Table",
                { defaultAlignment: go.Spot.Left },
                $(go.TextBlock, { row: 0, column: 0, columnSpan: 2, font: "bold 12pt sans-serif" },
                  new go.Binding("text", "key")),
                $(go.TextBlock, { row: 1, column: 0 }, "Description:"),
                $(go.TextBlock, { row: 1, column: 1 }, new go.Binding("text", "desc")),
                $(go.TextBlock, { row: 2, column: 0 }, "Color:"),
                $(go.TextBlock, { row: 2, column: 1 }, new go.Binding("text", "color"))
              )
            );

          // create the nodeTemplateMap, holding three node templates:
          var templmap = new go.Map(); // In TypeScript you could write: new go.Map<string, go.Node>();
          // for each of the node categories, specify which template to use
          templmap.add("simple", simpletemplate);
          templmap.add("detailed", detailtemplate);
          // for the default category, "", use the same template that Diagrams use by default;
          // this just shows the key value as a simple TextBlock
          templmap.add("", diagram.nodeTemplate);

          diagram.nodeTemplateMap = templmap;

          diagram.model.nodeDataArray = [
            { key: "Alpha", desc: "first letter", color: "green" },  // uses default category: ""
            { key: "Beta", desc: "second letter", color: "lightblue", category: "simple" },
//            { key: "Gamma", desc1: "third letter", color: "pink", category: "detailed", meta: {version: 1, name: , ...}},
            { key: "Delta", desc: "fourth letter", color: "cyan", category: "detailed" }
          ];


}
