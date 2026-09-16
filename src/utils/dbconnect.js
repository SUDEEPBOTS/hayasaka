import mongoose from "mongoose"

const MONGODB_URL = process.env.MONGODB_URL;
const DB_NAME = process.env.DB_NAME || "stroge_public";



const dbConnect = async () => {
    if (!MONGODB_URL) {
        return;
    }
    if (mongoose.connection.readyState >= 1) {
        return;
    }
    return mongoose.connect(MONGODB_URL, {
        dbName: DB_NAME,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(()=>console.log("connected to db")).catch((err)=>console.log(err));
}

export default dbConnect;