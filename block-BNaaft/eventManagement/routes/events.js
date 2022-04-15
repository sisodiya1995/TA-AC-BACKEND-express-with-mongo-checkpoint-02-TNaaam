var express = require("express");
var router = express.Router();
var Events = require("../modals/events");
var Remark = require("../modals/remark");
var moment = require("moment");
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

router.get("/", (req, res, next) => {
  Events.find({}, (err, events) => {
    Events.distinct("event_category", (err, evs) => {
      console.log(evs);
      Events.distinct("location", (err, evsa) => {
        console.log(evsa);
        res.render("events.ejs", { events, evs, evsa });
      });
    });
  });
});

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
    console.log(event);
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

// filter by catagary

router.post("/catagery", (req, res, next) => {
  //console.log(req.body)
  Events.find(req.body, (err, events) => {
    console.log(err, events);
    Events.distinct("event_category", (err, evs) => {
      console.log(evs);
      Events.distinct("location", (err, evsa) => {
        res.render("events", { events, evs, evsa });
      });
    });
  });
});

//filter by location

router.post("/location", (req, res, next) => {
  //console.log(req.body)
  Events.find(req.body, (err, events) => {
    console.log(err, events);
    Events.distinct("location", (err, evsa) => {
      console.log(evsa);
      Events.distinct("event_category", (err, evs) => {
        res.render("events", { events, evs, evsa });
      });
    });
  });
});

router.post("/date", (req, res, next) => {
  console.log(req.body);
  var start = req.body.start_date;
  var end = req.body.end_date;
  Events.find({ start_date: { $gte: start, $lt: end } }, (err, events) => {
    // console.log(dataa.start_date)
    //console.log(dataa)
    // res.render('events' ,{events, evs,evsa})
    Events.distinct("location", (err, evsa) => {
      console.log(evsa);
      Events.distinct("event_category", (err, evs) => {
        res.render("events", { events, evs, evsa });
      });
    });
  });
});
module.exports = router;
