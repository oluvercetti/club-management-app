
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },

    password: {
        type: String,
        required: true,
        minlength: 4,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes("password")) {
                throw new Error("Password cannot contain \"password\"");
            }
        },
    },

    role: {
        type: Number,
        required: true,
    },

    token: {
        type: String,
        required: true,
    },

    status: {
        type: Boolean,
        default: true,
    }
    
}, {
    timestamps: true,
});

adminSchema.virtual("roles", {
    ref: "Role",
    localField: "_id",
    foreignField: "owner",
});

adminSchema.virtual("transactions", {
    ref: "Transaction",
    localField: "_id",
    foreignField: "owner",
});

adminSchema.methods.generateAuthToken = async function() {
    const expiresIn = 3600;
    const admin = this;
    const token = jwt.sign({ _id: admin._id.toString() }, process.env.TOKEN_SECRET_KEY, { expiresIn });

    admin.token = token;
    await admin.save();
    return token;
};

adminSchema.methods.toJSON = function() {
    const admin = this;
    const adminObject = admin.toObject();

    delete adminObject.password;
    delete adminObject.token;
    delete adminObject.__v;
    return adminObject;
};

adminSchema.statics.findByCredentials = async(username, password) => {
    const admin = await Admin.findOne({ username });

    if (!admin) {
        throw new Error("Incorrect username or password");
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
        throw new Error("Incorrect username or password");
    }

    if (!admin.status) {
        throw new Error("This user is inactive, Kindly contact admin");
    }

    return admin;
};

adminSchema.statics.checkUserPermission = async(role_id, allowed_roles) => {
    
    const isAllowed = allowed_roles.includes(role_id);
    if (!isAllowed) {
        throw new Error("User can not perform this action");
    }

    return true;
};

adminSchema.pre("save", async function(next) {
    const admin = this;

    if (admin.isModified("password")) {
        admin.password = await bcrypt.hash(admin.password, 8);
    }

    next();
});

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;