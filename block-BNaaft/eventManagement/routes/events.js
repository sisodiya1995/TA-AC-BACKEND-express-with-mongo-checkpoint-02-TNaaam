var express = require("express");
var router = express.Router();
var Events = require("../modals/events");
var Remark = require("../modals/remark");
var moment = require("moment");
var auth = require("../middlewares/auth");
/* GET users listing. */

//  create route

router.get("/new", function (req, res, next) {
  res.render("eventForm");
});

router.post("/", (req, res, next) => {
  // console.log(req.body)
  Events.create(req.body, (err, event) => {
    console.log(event);
    if (err) return next(err);
    res.redirect("/events/new");
  });
});

// read route

router.get("/", auth.getLocationAndCatageory, (req, res, next) => {
  Events.find({}, (err, events) => {
    res.render("events.ejs", { events });
  });
});

// Edit route
router.get("/:id/edit", (req, res, next) => {
  var id = req.params.id;
  Events.findById(id, (err, event) => {
    var start_date = moment(event.start_date).format().slice(0, 10);
    var end_date = moment(event.end_date).format().slice(0, 10);
    if (err) return next(err);
    res.render("editEventForm", { event, start_date, end_date });
  });
});

router.post("/:id/edit", (req, res, next) => {
  var id = req.params.id;
  Events.findByIdAndUpdate(id, req.body, (err, event) => {
    if (err) return next(err);
    res.redirect("/events/" + id);
  });
});

// Delete route
router.get("/:id/delete", (req, res, next) => {
  var id = req.params.id;
  Events.findByIdAndDelete(id, (err, deleteEvent) => {
    if (err) return next(err);
    res.redirect("/events/");
  });
});

// Events likes

router.get("/:id/like", (req, res, next) => {
  var id = req.params.id;

  Events.findByIdAndUpdate(id, { $inc: { likes: 1 } }, (err, event) => {
    //console.log(event);
    if (err) return next(err);
    res.redirect("/events/" + id);
  });
});

// Events dislikes

router.get("/:id/dislike", (req, res, next) => {
  var id = req.params.id;
  Events.findById(id, (err, event) => {
    if (event.likes > 0) {
      Events.findByIdAndUpdate(id, { $inc: { likes: -1 } }, (err, event) => {
        console.log(event);
        if (err) return next(err);
        res.redirect("/events/" + id);
      });
    } else {
      res.redirect("/events/" + id);
    }
  });
});

//add remark
router.post("/:id/remark", (req, res, next) => {
  req.body.eventID = req.params.id;
  Remark.create(req.body, (err, remark) => {
    console.log(remark);
    if (err) return next(err);
    Events.findByIdAndUpdate(
      req.params.id,
      { $push: { remarkID: remark.id } },
      (err, updateevent) => {
        console.log(err, updateevent);
        res.redirect("/events/" + req.params.id);
      }
    );
  });
});

// All filters
router.get("/filters", auth.getLocationAndCatageory, (req, res, next) => {
  var catagery = req.query.event_category;
  var location = req.query.location;
  var start_date = req.query.start_date;
  var end_date = req.query.end_date;

  console.log(catagery, "catageory");
  if (catagery) {
    Events.find({ event_category: catagery }, (err, events) => {
      // console.log(err, events);
      if (err) return next(err);
      res.render("events", { events });
    });
  } else if (location) {
    Events.find({ location: location }, (err, events) => {
      // console.log(err, events);
      if (err) return next(err);
      res.render("events", { events });
    });
  } else if (start_date && end_date) {
    Events.find(
      { start_date: { $gte: start_date, $lt: end_date } },
      (err, events) => {
        
        if (err) return next(err);
        res.render("events", { events });
      }
    );
  }
});

// single event details
router.get("/:id", (req, res, next) => {
  var id = req.params.id;
  Events.findById(id)
    .populate("remarkID")
    .exec((err, events) => {
      var start_date = moment(events.start_date)
        .format("DD/MM/YYYY")
        .slice(0, 10);
      var end_date = moment(events.end_date).format("DD/MM/YYYY").slice(0, 10);
      if (err) return next(err);
      res.render("singleEvent", { events, start_date, end_date });
    });
});

module.exports = router;
