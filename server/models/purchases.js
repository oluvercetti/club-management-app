const mongoose = require("mongoose");
// import { Schema, model } from "mongoose";
const purchasesSchema = new mongoose.Schema({

    trans_id: {
        type: Number,
        unique: true,
    },

    mode_of_payment: {
        type: String,
        required: true,
    },

    amount: {
        type: Number,
        required: true,
    },

    denomination: {
        type: String,
        required: true,
    },

    coordinator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Admin",
    },
}, {
    timestamps: true,
});

purchasesSchema.pre("save", function (next) {
    // Access the document being saved
    const purchase = this;
    const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    // Create a unique identifier based on amount, denomination, trans_id, and username
    const uniqueIdentifier = `${currentDate}${purchase.denomination}${purchase.amount}${purchase.trans_id}`.padEnd(30, '0');

    // Set the trans_id to the unique identifier
    purchase.trans_id = uniqueIdentifier;

    // Continue with the save operation
    next();
});

const Purchases = mongoose.model("Purchases", purchasesSchema);
module.exports = Purchases;