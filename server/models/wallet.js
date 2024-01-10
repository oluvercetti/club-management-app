const mongoose = require("mongoose");
// import { Schema, model } from "mongoose";
const walletSchema = new mongoose.Schema({

    currency: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        minlength: 4
    },

    denomination: {
        type: String,
        required: true,
    },

    wallet_type: {
        type: String,
        required: true,
    },

    value: {
        type: Number,
        required: true,
    }
}, {
    timestamps: true,
});

walletSchema.methods.toJSON = function() {
    const wallet = this;
    const walletObject = wallet.toObject();
    delete walletObject.__v;
    return walletObject;
};

const Wallet = mongoose.model("Wallet", walletSchema);
module.exports = Wallet;