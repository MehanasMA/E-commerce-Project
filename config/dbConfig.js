if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const mongoose = require("mongoose");

const dbconfig = async () => {
    try {
        await mongoose.connect(process.env.mongoConnect, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Mongooseeeee!!!");
    } catch {
        console.log("MONGO ERROR!!!!");
        console.log(err);
        process.exit();
    }
};
module.exports = dbconfig;