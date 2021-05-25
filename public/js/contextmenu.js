/**main contextMenu of the diagram*/
diagram.contextMenu =
    $("ContextMenu",
        $("ContextMenuButton",
            $(go.TextBlock, "Undo"),
            { click: function (e, obj) { e.diagram.commandHandler.undo(); } },
            new go.Binding("visible", "", function (o) {
                return o.diagram.commandHandler.canUndo();
            }).ofObject()),
        $("ContextMenuButton",
            $(go.TextBlock, "Redo"),
            { click: function (e, obj) { e.diagram.commandHandler.redo(); } },
            new go.Binding("visible", "", function (o) {
                return o.diagram.commandHandler.canRedo();
            }).ofObject()),
        $("ContextMenuButton",
            $(go.TextBlock, "New Node"),
            {
                click: function (e, obj) {
                    e.diagram.commit(function (d) {
                        var openModal = document.getElementById("create-modal-btn");
                        document.getElementById("contextMenu").value = "diagramContextMenu";
                        openModal.click();
                    });
                }
            }
        ));

/**function to add a node with link*/
function addNodeAndLink() {
    var openModal = document.getElementById("create-modal-btn");
    document.getElementById("contextMenu").value = "nodeContextMenuAdd";
    openModal.click();
}

/**function to handle diffrent node adding possibilities depending 
  on the hidden input value of "contextMenu" */
function handleContextMenuOptions(newNode) {
    var contextMenuValue = document.getElementById("contextMenu").value;
    if (contextMenuValue === "nodeContextMenuAdd") {
        const newLink = { from: diagram.selection.toArray()[0].key, to: newNode.key };
        addLinkToDiagram(newLink);
        document.getElementById("contextMenu").value = "default";
    }
    if (contextMenuValue === "diagramContextMenu") {
        const part = diagram.findPartForData(newNode);
        console.log(part);
        pos = diagram.toolManager.contextMenuTool.mouseDownPoint;
        part.location = pos;
        document.getElementById("contextMenu").value = "default";
    }
}