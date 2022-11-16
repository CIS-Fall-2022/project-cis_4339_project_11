const express = require("express"); 
const router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;  

//importing data model schemas
let { organizationdata  } = require("../models/models"); 
//allow using a .env file
require("dotenv").config(); 

router.get("/",(req, res, next)=>{ //Gets organization data to be used in the frontend. (replaces "Dataplatform")
    organizationdata.findById(process.env.ORGANIZATION, //https://www.tutorialspoint.com/how-to-find-by-id-in-mongodb
        (error,data) => {
            if (error){
                return next(error)
            } else {
                res.json(data)
            }
        }
        );
        console.log(typeof req.params.id)
});
module.exports = router;