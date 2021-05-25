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
                        addNodeManager = "DiagramCanvasContextMenu";
                        document.getElementById("contextMenu").value = "diagramContextMenu";
                        openModal.click();
                    });
                }
            }
        ));

function addNodeAndLink() {
    var openModal = document.getElementById("create-modal-btn");
    addNodeManager = "DiagramCanvasContextMenu";
    document.getElementById("contextMenu").value = "nodeContextMenuAdd";
    openModal.click();
}

function handleContextMenuOptions(newNode) {
    var contextMenuValue = document.getElementById("contextMenu").value;
    if (contextMenuValue === "nodeContextMenuAdd") {
        const newLink = { from: diagram.selection.toArray()[0].key, to: newNode._id };
        addLinkToDiagram(newLink);
        document.getElementById("contextMenu").value = "default";
        return newNode.loc;
    }
    if (contextMenuValue === "diagramContextMenu") {
        console.log(newNode.loc);
        newNode.loc = diagram.toolManager.contextMenuTool.mouseDownPoint;
        document.getElementById("contextMenu").value = "default";
        return newNode.loc;
    }
}