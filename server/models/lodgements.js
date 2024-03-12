const mongoose = require("mongoose");
// import { Schema, model } from "mongoose";
const lodgementsSchema = new mongoose.Schema({

    trans_id: {
        type: String,
        unique: true,
    },

    mode_of_payment: {
        type: String,
        required: true,
    },

    username: {
        type: String,
        required: true,
    },

    amount: {
        type: Number,
        required: true,
    },

    service_type: {
        type: String,
        required: true,
    },

    coordinator: {
        type: String,
        required: true,
    },

    cashier: {
        type: String,
        required: true,
        ref: "Admin",
    },

    status: {
        type: String,
        default: "Closed",
    },

    voided_by: {
        type: String,
        ref: "Admin",
    }
}, {
    timestamps: true,
});

lodgementsSchema.pre("save", function (next) {
    // Access the document being saved
    const lodgement = this;
    if (lodgement.isNew) {
        const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        // Create a unique identifier based on amount, denomination, trans_id, and username
        const uniqueIdentifier = `${currentDate}${lodgement.amount}${lodgement.trans_id}`.padEnd(20, '0');
    
        // Set the trans_id to the unique identifier
        lodgement.trans_id = uniqueIdentifier;
    }

    // Continue with the save operation
    next();
});

const Lodgements = mongoose.model("Lodgements", lodgementsSchema);
module.exports = Lodgements;