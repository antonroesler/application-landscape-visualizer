
/**
 * Returns the number of nodes in the NodeDataAarry
 * @returns {number} of Nodes
 */
function totalNumberOfNodes(){
    return totalNumberOf('nodes')
}

/**
 * Returns the number of nodes in the NodeDataAarry
 * @returns {number} of Nodes
 */
function totalNumberOfLinks(){
    return totalNumberOf('links')
}

/**
 * Returns the total number of nodes or links.
 * @param part 'nodes' or 'links'
 * @returns {number}
 */
function totalNumberOf(part){
    try {
        if (part.toLowerCase().startsWith('link')){
            return model.linkDataArray.length
        } else{
            return model.nodeDataArray.length
        }
    } catch (e){
        createToast(part+"DataArray is missing", 'fail')
        return 0;
    }
}