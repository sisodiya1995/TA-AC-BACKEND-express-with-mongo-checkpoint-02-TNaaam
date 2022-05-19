var Events = require('../modals/events')

module.exports = {
    getLocationAndCatageory : function(req ,res ,next){
        Events.distinct("event_category", (err, evs) => {
            if (err) return next(err)
            Events.distinct("location", (err, evsa) => {
                if (err) return next(err)
                res.locals.location = evsa;
                res.locals.catageory = evs;
                next()
            });
          });
    }
}