

function hx(){
    var node = diagram.findNodeForKey("1621604986182");
    console.log(node)
    diagram.model.commit(function (m){
        m.set(node.data, "stroke", "green")
    }, "change stroke")
}