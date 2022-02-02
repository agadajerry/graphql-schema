import { buildSchema } from "graphql";


const schema = buildSchema(`

type Course{
    id:ID
    courseName:String
    category:String
    price:Int
    language:String
    email: String
    stack:Stack
    officeAssist: [TeachAssist]
}

type TeachAssist{
    firstName:String
    lastName:String
    experience: Int
}

enum Stack{
    Node
    Java
}

type Query{

    getCourse(id:ID):Course
}

input  inputCourse{
    id:ID
    courseName:String
    category:String
    price:Int
    language:String
    email: String
    stack:Stack
    officeAssist: [TeachAssist]
}

input inputTeachAssist{

    firstName:String
    lastName:String
    experience: Int
}

type Mutation{
    createCourse(input inputCourse):Course
}

`)

export default schema