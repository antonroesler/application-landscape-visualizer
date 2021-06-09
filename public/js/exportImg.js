/*
* Copyright (c) 2021 Ecore. All rights reserved.
*
* University:        Frankfurt University of Applied Sciences
* Study program:     Engineering Business Information Systems
* Module:            Advanced Programming 2021
* Professor:         Prof. Dr. Jung, Prof. Dr. Bremm
* Date:              21.04.2021
*
*/

/**
 * Contains functions to export a diagram as png or svg image file.
 *
 * @author Anton Roesler
 */


/**
 * Reads all data from the export-modal and handles all downloads.
 */
function exportDiagram(){
    let img_name = document.getElementById('exp-name').value;
    if (img_name === ""){
        img_name = "Chart";
    }
    if (document.getElementById('exp-png').checked){
        download(makePngElement(), img_name, "png")
    }
    if (document.getElementById('exp-png-white').checked){
        download(makePngElement(true), img_name+"-white-bg", "png")
    }
    if (document.getElementById('exp-svg').checked){
        download(makeSvgElement(), img_name, "svg")
    }
}

/**
 * Creates a base64 string from the diagram that can be used as a href to download an image as png.
 * @param bgWhite Must be set to true if the png should have white background, else it will be transparent
 * @returns {base64 string} that can be inserted to download the image as png
 */
function makePngElement(bgWhite = false){
    const params = {};
    if (bgWhite){
        params["background"] = "#FFFFFF";
    }
    return diagram.makeImageData(params);
}


/**
 * Creates a svg blob from the diagram that can be used as a href to download an image as svg.
 * @returns {svg blob string} that can be inserted to download the image as png
 */
function makeSvgElement(){
    const svgData = diagram.makeSVG().outerHTML;
    const svgBlob = new Blob([svgData], {type:"image/svg+xml;charset=utf-8"});
    return URL.createObjectURL(svgBlob);
}

/**
 * Downloads a image inside the browser. Image must be in form of a decoded string that can be inserted to an href.
 * @param serializedImage image string
 * @param title name of the image
 * @param format image format ('png', 'svg')
 */
function download(serializedImage, title, format){
    const a = document.createElement("a");
    a.href = serializedImage;
    a.download = title + "." + format;
    a.click();
}