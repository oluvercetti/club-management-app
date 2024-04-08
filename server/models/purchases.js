const mongoose = require("mongoose");
// import { Schema, model } from "mongoose";
const purchasesSchema = new mongoose.Schema({

    trans_id: {
        type: String,
        unique: true,
    },

    amount_booked: {
        type: Number,
        required: true,
    },

    amount_sold: {
        type: Number,
        default: 0,
    },

    amount_returned: {
        type: Number,
        default: 0,
    },

    denomination: {
        type: String,
        required: true,
    },

    service_charge_amount: {
        type: Number,
        default: 0,
    },

    status: {
        type: String,
        default: "Open",
    },

    coordinator: {
        type: String,
        required: true,
        ref: "Admin",
    },
    
    cashier: {
        type: String,
        ref: "Admin",
    },

    voided_by: {
        type: String,
        ref: "Admin",
    }
}, {
    timestamps: true,
});

purchasesSchema.pre("save", function (next) {
    // Access the document being saved
    const purchase = this;
    if (purchase.isNew) {
        const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        // Create a unique identifier based on amount, denomination, trans_id, and username
        const uniqueIdentifier = `${currentDate}${purchase.denomination}${purchase.amount_booked}${purchase.trans_id}`.padEnd(20, '0');
    
        // Set the trans_id to the unique identifier
        purchase.trans_id = uniqueIdentifier;
    }

    // Continue with the save operation
    next();
});

const Purchases = mongoose.model("Purchases", purchasesSchema);
module.exports = Purchases;