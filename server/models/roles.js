const mongoose = require("mongoose");

const rolesSchema = new mongoose.Schema({
    
    role_id: {
        type: Number,
        unique: true
    },

    role_name: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        minlength: 4
    },

    role_description: {
        type: String,
    }
}, {
    timestamps: true,
});

// Create a counter to generate unique role IDs
const rolesCounterSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    value: {
        type: Number,
        default: 0,
    },
});

// Define a method to increment the counter value and save the updated value
rolesCounterSchema.statics.getNextValue = async function(id) {
    const counter = await this.findOneAndUpdate({ id }, { $inc: { value: 1 } }, { new: true, upsert: true });
    return counter.value;
};

// Create a Mongoose model for the role counter
const RoleCounter = mongoose.model("RoleCounter", rolesCounterSchema);

async function generateRoleId(role) {
    role.role_id = await RoleCounter.getNextValue("role_id");
}

// Add a pre-save hook to the ticket schema to generate a unique ticket ID before saving
rolesSchema.pre("save", async function(next) {
    const role = this;
    if (!role.role_id) {
        await generateRoleId(role);
    }
    next();
});

const Roles = mongoose.model("Roles", rolesSchema);
module.exports = Roles;