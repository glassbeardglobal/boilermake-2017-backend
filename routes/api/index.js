var express = require('express');
var router = express.Router();

/**
 * @api {get} /api Root
 * @apiName GetAPIRoot
 * @apiGroup Index
 * @apiDescription This path gets the root of the API
 * @apiSuccessExample Success-Response
 * {
 *   "success": true,
 *   "message":"API Root"
 * }
**/
router.get('/', function(req, res, next) {
    res.json({
        "success": true,
        "message": "API Root"
    });
});

router.post('/login', function(req, res, next) {
    res.json({
        "success": true
    });
});

router.use('/users', require('./users'));
router.use('/goals', require('./goals'));

module.exports = router;


