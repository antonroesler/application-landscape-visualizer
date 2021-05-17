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




router.get('/', async (req, res) => {
    let n = Number(req.query.n);
    let base = req.query.color;
    if (!n || n<1){
        n=1;
    };
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


module.exports = router;