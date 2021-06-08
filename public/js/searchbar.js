

function searchbarInput(){
    const searchtext = document.getElementById("searchbar").value
    if (searchtext === ""){
        makeAllNodesFullOpacity()
    } else {
        model.nodeDataArray.forEach(node => {
            if (node.name.toLowerCase().startsWith(searchtext.toLowerCase())) {
                setOpacity(node, 1)
            }
            else {
                setOpacity(node)
            }
        })
    }
    setLinkOpacity()

}