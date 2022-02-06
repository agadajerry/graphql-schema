import mongoose, { Mongoose } from "mongoose";

const studentSchema = new mongoose.Schema({

    studentId: { type:Number},
    name:{type: String},
    age:{type: Number},
    address:{type: String},
},{timestamps:true})


const Student = mongoose.model("Students", studentSchema)

export default Student;