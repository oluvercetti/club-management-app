const mongoose = require("mongoose");

const servicesSchema = new mongoose.Schema({

    service_name: {
        type: String,
        required: true,
        unique: true,
        minlength: 4
    },

    status: {
        type: Boolean,
        default: true,
    }
}, {
    timestamps: true,
});


const Services = mongoose.model("Services", servicesSchema);
module.exports = Services;