

function searchbarInput(){
    const searchtext = document.getElementById("searchbar").value
    if (searchtext === ""){
        removeStrokeFromAllNodesInDiagram()
    } else {
        model.nodeDataArray.forEach(node => {
            if (node.nameProperty.toLowerCase().startsWith(searchtext.toLowerCase())) {
                addStroke(node)
            }
            else {
                removeStroke(node)
            }
        })
    }

}