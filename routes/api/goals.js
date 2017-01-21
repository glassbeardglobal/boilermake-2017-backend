var express = require('express');
var mongoose = require('mongoose');
var _ = require('lodash');
var moment = require('moment');

var router = express.Router();
var User = require('../../models/User');
var Goal = require('../../models/Goal');

router.post('/', function(req, res, next) {
  User.findById(req.body.userId, function(err, user) {
    if (err)
      return next(err);
    req.body.costPerFail = user.costPerFail;
    Goal.create(req.body, function(err, goal) {
      if (err)
        return next(err);
      User.update({ _id: req.body.userId }, { $push: { "goals": goal._id }}, function(err, user) {
        if (err)
          return next(err);
        res.json({
          "success": true,
          "goal": goal
        });
      });
    });
  });
});

router.post('/fake/:id', function(req, res, next) {
  var h = req.body.date;
  Goal.update({ _id: req.params.id }, { $push: { "history": new Date(h) }}, function(err, goal) {
    if (err)
      return next(err);
    res.json({
      "success": true,
      "goal": goal
    });
  });
});

router.post('/fulfill/:id', function(req, res, next) {
  Goal.update({ _id: req.params.id }, { $push: { "history": new Date() }}, function(err, goal) {
    if (err)
      return next(err);
    res.json({
      "success": true,
      "goal": goal
    });
  });
});

router.get('/fulfilled/:id', function(req, res, next) {
  Goal.findById(req.params.id, function(err, goal) {
    var today = new Date();
    var r = false;
    goal.history.forEach(function(g) {
      if (today.setHours(0,0,0,0) == g.setHours(0,0,0,0)) {
        r = true;
      }
    });
    res.json({
      "success": true,
      "fulfilled": r
    });
  });
});

router.get('/bill/:id', function(req, res, next) {
  Goal.findById(req.params.id, function(err, goal) {
    var start = goal.createdAt;
    var groupedResults = _.groupBy(goal.history, (result) => moment(result, 'DD/MM/YYYY').startOf('isoWeek'));
    var now = new Date();
    var weeks = Math.round((now-start) / 604800000);
    var freq = goals.frequency;
    var res = 0;
    var wc = 0;
    for (var k in groupedResults) {
      wc += 1;
      res += Math.max(0, (groupedResults[k].length - freq) * goal.costPerFail);
    }
    res += Math.max(0, (weeks - wc - 1) * 7 * goal.costPerFail);
    res.json({
      "success": true,
      "bill": res
    });
  });
});

router.get('/:id', function(req, res, next) {
  Goal.findById(req.params.id, function(err, goal) {
    if (err)
      return next(err);
    res.json({
      "success": true,
      "goal": goal
    });
  });
});

router.delete('/:id', function(req, res, next) {
    Goal.findById(req.params.id).remove((err, goal) => {
        if (err)
            return next(err);
        res.json({
            "success": true,
            "deleted": goal
        });
    });
});

module.exports = router;
