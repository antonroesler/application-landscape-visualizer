




/* Total number of Nodes / Links*/
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

/* Average number of children / parents*/

/**
 * Returns avg number of child nodes.
 * @returns {*}
 */
function avgNumberOfChildren(){
    return _avgNumberOf(numberOfChildNodes)
}

/**
 * Returns avg number of parent nodes
 * @returns {*}
 */
function avgNumberOfParents(){
    return _avgNumberOf(numberOfParentNodes)
}

/**
 * Returns average of all nodes for a function that returns a numeric value for each node.
 * @param getter e.g. numberOfParentNodes
 * @returns {*}
 * @private
 */
function _avgNumberOf(getter){
    const numbers = [];
    model.nodeDataArray.forEach(node => {
        numbers.push(getter(node))
    })
    return meanOfArray(numbers);
}

function meanOfArray(arr){
    return arr.reduce(function(sum, a) { return sum + a },0)/(arr.length||1);
}
