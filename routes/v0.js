/**
 * Route to GET all AppNodes in the DB.
 * Sends a list of JSON objects: [{},{}...] in the body of the http response.
 */
router.get('/node', async (req, res) => {
    try {
        const appNodes = await AppNode.find();
        res.json(appNodes);
    }catch (err){
        res.json(err);
    }
});

/**
 * Route to GET all Links in the DB.
 * Sends a list of JSON objects: [{},{}...] in the body of the http response.
 */
router.get('/link', async (req, res) => {
    try {
        const links = await Link.find();
        res.json(links);
    }catch (err){
        res.json(err);
    }
});


/**
 * Route to POST a new AppNode to the DB.
 * Requires a AppNode as JSON object where at least the name is specified.
 *
 * Sends the JSON object as it is stored in the mongoDb including the _id attribute in the body of the http response.
 */
router.post('/node', async (req, res) => {
    const appNode = new AppNode({
        name: req.body.name,
        category: req.body.category,
        desc: req.body.desc
    });
    try {
        const savedAppNode = await appNode.save()
        res.json(savedAppNode);

    }catch (err){
        res.json(err)
    }
})

/**
 * Route to POST a new Link to the DB.
 * Requires a Link as JSON object where at least from and to attributes are specified.
 *
 * Sends the JSON object as it is stored in the mongoDb including the _id attribute in the body of the http response.
 */
router.post('/link', async (req, res) => {
    const link = new Link({
        from: req.body.name,
        to: req.body.category
    });
    try {
        const savedLink = await link.save()
        res.json(savedLink);
    }catch (err){
        res.json(err)
    }
})

/**
 * Route to GET a specific AppNode.
 *
 * Sends AppNodes as (a List of) JSON objects in the body of the response.
 */
router.get('/node/:id', async (req, res) => {
    const appNode = await AppNode.findById({name:req.params.id})
    res.json(appNode)
})


/**
 * Route to DELETE a specific AppNode from the DB ny its _id attribute.
 * /mongo/node/id/6091a
 * to delete the AppNodes where _id: 6091a
 *
 * Sends the deleted AppNode as JSON object in response body.
 */
router.delete('/node/:id', async (req, res) => {
    const deletedAppNode = await AppNode.findByIdAndDelete(req.params.id)
    res.json(deletedAppNode)
})

/**
 * Route to DELETE a specific AppNode from the DB ny its _id attribute.
 * /mongo/node/id/6091a
 * to delete the AppNodes where _id: 6091a
 *
 * Sends the deleted AppNode as JSON object in response body.
 */
router.delete('/link/:id', async (req, res) => {
    const deletedLink = await Link.findByIdAndDelete(req.params.id)
    res.json(deletedLink)
})