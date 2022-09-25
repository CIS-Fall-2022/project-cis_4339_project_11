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
    organization: { //Adds organization field with a default value, found on https://mongoosejs.com/docs/defaults.html
        type: String,
        required: true,
        default: process.env.ORGANIZATION //Will change depending on the .env variable.
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
    organization: {
        type: String,
        required: true,
        default: process.env.ORGANIZATION
    }
}, {
    collection: 'eventData'
});

let organizationDataSchema = new Schema({
    _id: { type: String, default: uuid.v1},
    organizationName: {
        type: String,
        require: true
    }
});

// create models from mongoose schemas
const primarydata = mongoose.model('primaryData', primaryDataSchema);
const eventdata = mongoose.model('eventData', eventDataSchema);

// package the models in an object to export 
module.exports = { primarydata, eventdata }
