import { Request, Response, NextFunction } from "express";
import Student from "../models/studentModel";
import Students from "../models/studentModel";

export const saveNewStudent = async (data: any) => {
  try {

    const { studentId, name, age, address }  = data;

    let student = await Students.create({
        studentId,
        name,
        age,
        address
    })
    if(student) return console.log("saved successfully...")

  } catch (error: any) {
    console.error(error);
  }
};


//get All students details

export const getStudentDetails = async (id:number)=>{
    try {
        const result  = await Students.findOne({studentId:id});

        if(result) return result

    } catch (error) {
        console.error(error);
    }
}


//get All Students

export const getAllStudentIds = async  ()=>{

    try {
        const result = await Students.find({});

         return result;
    } catch (error:any) {
        console.error(error)
    }
}

export const updateStudentInfo = async (id:string,data:any)=>{

    try {
        const { studentId, name, age, address }  = data;

        let student = await Students.findByIdAndUpdate(id,{
            studentId,
            name,
            age,
            address
        })

        return student;

    } catch (error) {
        
    }

}