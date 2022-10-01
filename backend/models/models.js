const uuid = require('uuid');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require("dotenv").config();  //To load ORGANIZATION variable

//collection for intakeData
let primaryDataSchema = new Schema({
    _id: { type: String, default: uuid.v1 },
    firstName: {
        type: String,
        require: true
    },
    middleName: {
        type: String,
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    phoneNumbers: {
        type: Array,
        required: true
    },
    address: {
        line1: {
            type: String
        },
        line2: {
            type: String,
        },
        city: {
            type: String,
            required: true
        },
        county: {
            type: String,
        },
        zip: {
            type: String,
        }
    },
    organization_id: { //Adds organization field with a default value, found on https://mongoosejs.com/docs/defaults.html
        type: String,
        required: true,
        //This allow the front end form to stay the same, this will be added to the form reqest body. 
        default: process.env.ORGANIZATION //Will change depending on the .env variable. In the .env file add ORGANIZATION = <Organization object ID>
    }
}, {
    collection: 'primaryData',
    timestamps: true
});

//collection for eventData
let eventDataSchema = new Schema({
    _id: { type: String, default: uuid.v1 },
    eventName: {
        type: String,
        require: true
    },
    services: {
        type: Array
    },
    date: {
        type: Date,
        required: true
    },
    address: {
        line1: {
            type: String
        },
        line2: {
            type: String,
        },
        city: {
            type: String,
        },
        county: {
            type: String,
        },
        zip: {
            type: String,
        }
    },
    description: {
        type: String,
    },
    attendees: [{
        type: String
    }],
    organization_id: {
        type: String,
        required: true,
        default: process.env.ORGANIZATION
    }
}, {
    collection: 'eventData'
});

let organizationDataSchema = new Schema({ //Creates schema for data that will be used for the "organization" items in the primaryData and eventData collections
    _id: { type: String, default: uuid.v1},
    organizationName: {
        type: String,
        require: true
    }
}, {
    collection: 'organizationData'
});

// create models from mongoose schemas
const primarydata = mongoose.model('primaryData', primaryDataSchema);
const eventdata = mongoose.model('eventData', eventDataSchema);
const organizationdata = mongoose.model('organizationData', organizationDataSchema)

// package the models in an object to export 
module.exports = { primarydata, eventdata, organizationdata }
