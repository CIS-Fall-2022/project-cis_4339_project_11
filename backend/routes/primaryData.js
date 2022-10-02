const express = require("express"); 
const router = express.Router(); 

//importing data model schemas
let { primarydata } = require("../models/models"); 
let { eventdata } = require("../models/models"); 

//allow using a .env file
require("dotenv").config(); 

//GET all entries
router.get("/", (req, res, next) => { 
    primarydata.find( {organization_id: process.env.ORGANIZATION}, //Filters to only show PrimaryData documents within the current instance. (https://www.mongodb.com/docs/manual/tutorial/query-documents/)
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
    primarydata.find( 
        { _id: req.params.id, organization_id: process.env.ORGANIZATION}, //Added ORGANIZATION filter, because a client can sign up for different organizations
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});

//GET entries based on search query
//Ex: '...?firstName=Bob&lastName=&searchBy=name' 
router.get("/search/", (req, res, next) => { 
    let dbQuery = "";
    if (req.query["searchBy"] === 'name') {
        dbQuery = { 
            firstName: { $regex: `^${req.query["firstName"]}`, $options: "i" },
            lastName: { $regex: `^${req.query["lastName"]}`, $options: "i" },
            organization_id: process.env.ORGANIZATION //Queries first and last names only within the organization's instance
        }
    } else if (req.query["searchBy"] === 'number') {
        dbQuery = {
            "phoneNumbers.primaryPhone": { $regex: `^${req.query["phoneNumbers.primaryPhone"]}`, $options: "i" },
            organization_id: process.env.ORGANIZATION //Queries phone numbers only within the organization's instance
        }
    };
    primarydata.find( 
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

//GET events for a single client
router.get("/events/:id", (req, res, next) => { 
    
});

//POST
router.post("/", (req, res, next) => { 
    primarydata.create( 
        req.body,
        (error, data) => { 
            if (error) {
                return next(error);
            } else {
                res.json(data); 
            }
        }
    );
    primarydata.createdAt;
    primarydata.updatedAt;
    primarydata.createdAt instanceof Date;
});

//PUT update (make sure req body doesn't have the id)
router.put("/:id", (req, res, next) => { 
    primarydata.findOneAndUpdate( 
        { _id: req.params.id }, 
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


//DELETE request 
router.delete("/:id", (req, res, next) => { 
    primarydata.findOneAndDelete( 
        { _id: req.params.id }, 
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                eventdata.updateMany({}, {$pull : {attendees: req.params.id}}).exec() // https://stackoverflow.com/questions/33123977/updating-more-than-one-mongodb-document-in-nodejs-doesnt-seem-to-work
                res.json(data);                                                       // above source used to troubleshoot issue where command was not pushing over successfully. .exec() was used as suggested
                
            }
        }
    );
});



//POSTMAN TEST: Get all entries (http://127.0.0.1:3000/primarydata/test/<organizationID>)
router.get("/test/:orgid", (req, res, next) => { 
    primarydata.find( {organization_id: req.params.orgid}, //Filters to only show PrimaryData documents within the current instance. (https://www.mongodb.com/docs/manual/tutorial/query-documents/)
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    ).sort({ 'updatedAt': -1 }).limit(10);
});

module.exports = router;
