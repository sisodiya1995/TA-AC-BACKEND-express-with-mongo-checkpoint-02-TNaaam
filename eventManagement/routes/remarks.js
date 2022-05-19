var express = require("express");
var router = express.Router();
var Events = require("../modals/events");
var Remark = require("../modals/remark");

// render form
// router.get('/:id/edit' ,(req ,res,next) =>{
//     res.render('editRemark')
// })

// Remark Edit Route
router.get("/:id/edit", (req, res, next) => {
  var id = req.params.id;
  Remark.findById(id, (err, remarks) => {
    console.log(remarks);
    if (err) return next(err);
    res.render("editRemark", { remarks: remarks });
  });
});

router.post("/:id/edit", (req, res, next) => {
  var id = req.params.id;
  Remark.findByIdAndUpdate(id, req.body, (err, remarks) => {
    console.log(remarks);
    if (err) return next(err);
    res.redirect("/events/" + remarks.eventID);
  });
});

// Remark Delete
router.get("/:id/delete", (req, res, next) => {
  var id = req.params.id;
  Remark.findByIdAndRemove(id, (err, deleteremarks) => {
    console.log(deleteremarks);
    if (err) return next(err);
    Events.findByIdAndUpdate(deleteremarks.eventID, {
      $pull: { remarkID: deleteremarks._id },
    });
    res.redirect("/events/" + deleteremarks.eventID);
  });
});

// Remarks likes

router.get("/:id/likes", (req, res, next) => {
  var id = req.params.id;
  console.log(id);
  Remark.findByIdAndUpdate(id, { $inc: { likes: 1 } }, (err, article) => {
    console.log(article);

    //if(err) return next(err)
    res.redirect("/events/" + article.eventID);
  });
});

// Remarks dislikes

router.get("/:id/dislikes", (req, res, next) => {
  var id = req.params.id;
  Remark.findById(id, (err, remark) => {
    if (remark.likes > 0) {
      Remark.findByIdAndUpdate(id, { $inc: { likes: -1 } }, (err, article) => {
        console.log(article);

        //if(err) return next(err)
        res.redirect("/events/" + article.eventID);
      });
    } else {
      Remark.findById(id, (err, article) => {
        res.redirect("/events/" + article.eventID);
      });
    }
  });
});

module.exports = router;
