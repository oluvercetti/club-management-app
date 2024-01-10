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

    dancer: {
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


const Transactions = mongoose.model("Transactions", transactionsSchema);
module.exports = Transactions;