const mongoose = require("mongoose");
// import { Schema, model } from "mongoose";
const transactionsSchema = new mongoose.Schema({

    trans_id: {
        type: Number,
        unique: true,
    },

    trans_type: {
        type: String,
        required: true,
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

    denomination: {
        type: String,
        required: true,
    },

    coordinator: {
        type: String,
        required: true,
    },

    cashier: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Admin",
    },
}, {
    timestamps: true,
});

transactionsSchema.pre("save", function (next) {
    // Access the document being saved
    const transaction = this;
    const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    // Create a unique identifier based on amount, denomination, trans_id, and username
    const uniqueIdentifier = `${currentDate}${transaction.denomination}${transaction.amount}${transaction.trans_id}`.padEnd(30, '0');

    // Set the trans_id to the unique identifier
    transaction.trans_id = uniqueIdentifier;

    // Continue with the save operation
    next();
});

const Transactions = mongoose.model("Transactions", transactionsSchema);
module.exports = Transactions;