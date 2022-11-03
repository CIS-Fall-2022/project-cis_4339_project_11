const express = require("express");
const router = express.Router();

//importing data model schemas
let { eventdata } = require("../models/models"); 

//GET all entries
router.get("/", (req, res, next) => { 
    eventdata.find( {organization_id: process.env.ORGANIZATION}, //Filters events to show events created within current organization instance
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    ).sort({ 'updatedAt': -1 }).limit(10);
});

//GET single entry by ID
router.get("/id/:id", (req, res, next) => { 
    //Adding "organization" as a find() parameter, multiple organzations can host the same event. (Functionality not within scope of this project, but its good to still have)
    eventdata.find({ _id: req.params.id, organization_id: process.env.ORGANIZATION }, (error, data) => { 
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
});

//GET entries based on search query
//Ex: '...?eventName=Food&searchBy=name' 
router.get("/search/", (req, res, next) => { 
    let dbQuery = "";
    if (req.query["searchBy"] === 'name') {
        dbQuery = { eventName: { $regex: `^${req.query["eventName"]}`, $options: "i" }, organization_id: process.env.ORGANIZATION }
    } else if (req.query["searchBy"] === 'date') {
        dbQuery = {
            date:  req.query["eventDate"]
        }
    };
    eventdata.find( 
        dbQuery, 
        (error, data) => { 
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});

//GET events for which a client is signed up
router.get("/client/:id", (req, res, next) => { 
    eventdata.find( 
        { attendees: req.params.id }, 
        (error, data) => { 
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});

//GET request for dashboard component
router.get("/dashboard",(req,res,next)=>{ //GET requests that counts the amount of attendees that signed of for an event each month
    const today = new Date()
    eventdata.aggregate([
        {
          '$match': {
            'organization_id': process.env.ORGANIZATION
          }
        }, {
          '$project': {
            'eventName': 1, 
            'date': 1, 
            'attendees_count': {
              '$size': '$attendees'  
            }
          }
          //$project result: 
          // {
                // _id: "<organization_id>"
                // eventName: "<event-name>"
                // date : <event date>
                // attendees_count : <length of attendees array>
            //}
        }, {
          '$group': {
            '_id': {
              '$month': '$date'
            }, 
            'attendees_count': {
              '$sum': '$attendees_count'
            }
          }
        },
        {
            '$project':{
                '_id': 0,
                'month': '$_id',
                'attendees': '$attendees_count'
            }
        },
        {
            '$sort': {'_id': -1}
        }
        //RESULTING JSON:
        // [
        //     {
        //         "month": 10, //MONTH (1-12)
        //         "attendees_count": 3  //Number of event attendees thats month
        //     },
        //     {
        //         "month": 11,
        //         "attendees": 3
        //     }
        // ]
      ],
      (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.json(data);
        }
    })
})

//POST
router.post("/", (req, res, next) => { 
    eventdata.create( 
        req.body, 
        (error, data) => { 
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});

//PUT
router.put("/:id", (req, res, next) => {
    eventdata.findOneAndUpdate(
        { _id: req.params.id, organization_id: process.env.ORGANIZATION },
        req.body,
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});

//PUT add attendee to event
router.put("/addAttendee/:id", (req, res, next) => {
    //only add attendee if not yet signed uo
    eventdata.find( 
        { _id: req.params.id, attendees: req.body.attendee }, 
        (error, data) => { 
            if (error) {
                return next(error);
            } else {
                if (data.length == 0) {
                    eventdata.updateOne(
                        { _id: req.params.id }, 
                        { $push: { attendees: req.body.attendee } },
                        (error, data) => {
                            if (error) {
                                consol
                                return next(error);
                            } else {
                                res.json(data);
                            }
                        }
                    );
                }
                
            }
        }
    );
});

//PUT remove attendee from event
router.put("/removeAttendee/:id", (req, res, next) => {
    eventdata.updateOne(
            { _id: req.params.id }, 
            { $pull: { attendees: req.body.attendee } },
            (error, data) => {
                if (error) {
                    consol
                    return next(error);
                } else {
                    res.json(data);
                }
            }
        );
    }          
);


//DELETE request 
router.delete("/:id", (req, res, next) => { 
    eventdata.findOneAndDelete( 
        { _id: req.params.id },
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});


module.exports = router;