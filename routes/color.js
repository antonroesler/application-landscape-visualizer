/*
* Copyright (c) 2021 Ecore. All rights reserved.
*
* University:		 Frankfurt University of Applied Sciences
* Study program:	 Engineering Business Information Systems
* Module:		     Advanced Programming 2021
* Professor:		 Prof. Dr. Jung, Prof. Dr. Bremm
* Date:			     03.05.2021
*
*/

/**
 * Color API. To get complementary colors. Returns colors as array of color hex strings.
 *
 * USAGE:
 * n: number of different colors needed
 *
 * localhost:8000/color?n=4
 * returns => ["#ed553b","#7aed3b","#3bd3ed","#ae3bed"]
 *---------
 * It is also possible to set a base color, the other colors will be complimentary to that color. The color may be specified in any format
 *
 * localhost:8000/color?n=4&color=red
 * returns => ["#ff0000","#80ff00","#00ffff","#7f00ff"]
 *
 * localhost:8000/color?n=4&color=A50901
 * returns => ["#a50901","#4ba501","#019da5","#5b01a5"]
 *
 * @author Anton Roesler
 *
 */

const express = require('express');
const router = express.Router();
const tinycolor = require("tinycolor2");
const tinygrad = require("tinygradient")




router.get('/', async (req, res) => {
    let n = Number(req.query.n);
    let base = req.query.color;
    if (!n || n<1){
        n=1;
    }
    if (!base){
        base = '#ED553B';
    }
    const colors = [];
    const step = 360/n;
    for (let i = 0; i < 360; i+=step) {
        colors.push(tinycolor(base).spin(i).toHexString())
    }
    res.json(colors);
});

/**
 * color/grad/ is used to return a gradient with n steps between two colors.
 *
 * http://localhost:8000/color/grad?n=6&a=ffffff&b=ff3333
 *
 * Returns an Array of length 6 startign with white (ffffff) to red (ff3333)
 *
 * If a or be is empty, a default gradient from red to light blue is used.
 */
router.get('/grad/', async (req, res) => {
    let n = Number(req.query.n);
    let c1 = "#" + req.query.a;
    let c2 = "#" + req.query.b;
    console.log(n)
    console.log(c1)
    console.log(c2)
    if (!n || n<1){
        n=3;
    }
    if (c1.length !== 7 || c2.length !== 7){
        c1 = '#ED553B';
        c2 = '#3bd3ed';
    }
    const gradient = tinygrad(c1, c2).rgb(n)
    const colors = []
    gradient.forEach(color => {
        let rgb = color._originalInput;
        if (!String(rgb).startsWith("#")){
            rgb = rgbToHex(Math.round(rgb.r), Math.round(rgb.g), Math.round(rgb.b));
        }
        colors.push(rgb)
    })

    res.json(colors);
});


/**
 * Converts an rgb value to a #hex string.
 * @returns {string}
 */
function rgbToHex(r,g,b) {
    r = r.toString(16);
    g = g.toString(16);
    b = b.toString(16);

    if (r.length == 1)
        r = "0" + r;
    if (g.length == 1)
        g = "0" + g;
    if (b.length == 1)
        b = "0" + b;

    return "#" + r + g + b;
}

module.exports = router;

