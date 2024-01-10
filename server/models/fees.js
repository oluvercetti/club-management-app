const mongoose = require("mongoose");
// import { Schema, model } from "mongoose";
const feesSchema = new mongoose.Schema({

    fee_name: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        minlength: 4
    },

    fee_type: {
        type: String,
        required: true,
    },

    fee_value: {
        type: Number,
        required: true,
    },

    status: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true,
});

feesSchema.methods.toJSON = function() {
    const fees = this;
    const feesObject = fees.toObject();
    delete feesObject.__v;
    return feesObject;
};

const Fees = mongoose.model("Fees", feesSchema);
module.exports = Fees;