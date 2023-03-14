const mongoose = require("mongoose");

const dbConnection = async () => {
    try {
        const conn = await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        if (conn) {
            console.log(`MongoDB Connected on ${conn.connection.host}`);
        } else {
            console.log("Failed to connect DB");
        }
    } catch (error) {
        console.log(`Failed with error: ${error.message}`);
    }
};
module.exports = dbConnection;
