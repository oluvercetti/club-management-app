const mongoose = require("mongoose");

const taskManagerConnectionURL = process.env.MONGODB_CONNECTION_STRING;

mongoose.set("strictQuery", false);

mongoose.connect(taskManagerConnectionURL, {
    useNewUrlParser: true,
});

// Event listener for when the connection is open
mongoose.connection.on("open", () => {
    console.log("Connected to MongoDB");
});

// Event listener for when the connection is closed
mongoose.connection.on("close", () => {
    console.log("Disconnected from MongoDB");
});