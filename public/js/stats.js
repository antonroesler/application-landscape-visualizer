/**
 * {
 *     Finance: 135,
 *     Data: 209,
 *     Development: 178,
 *     HR: 45,
 * }
 *
 */


function generateHistDataMult(x){
    const data = {};
    model.nodeDataArray.forEach(node => {
        node[x].forEach(dep => {
            if (Object.keys(data).includes(dep)){
                data[dep]++;
            } else{
                data[dep] = 1;
            }
        })
    })
    return data;
}

function generateHistData(x){
    const data = {};
    model.nodeDataArray.forEach(node => {
        if (Object.keys(data).includes(node[x])){
                data[node[x]]++;
            } else{
                data[node[x]] = 1;
            }
        })
    return data;
}