import {
  saveNewStudent,
  getStudentDetails,
  getAllStudentIds,
  updateStudentInfo
} from "./routes/studentController";
//   import Students from "./"

import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLInputObjectType,
  GraphQLSchema,
  GraphQLBoolean,
  GraphQLList,
} from "graphql";

// graphQl schema for  adding students

const StudentInfo = new GraphQLObjectType({
  name: "studentInfo",
  fields: () => {
    return {
      studentId: { type: GraphQLInt },
      name: { type: GraphQLString },
      age: { type: GraphQLInt },
      address: { type: GraphQLString },
      _id: { type:GraphQLString}
    };
  },
});

const AddStudentInput = new GraphQLInputObjectType({
  name: "inputStudent",
  fields: {
    studentId: { type: GraphQLInt },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    address: { type: GraphQLString },
  },
});

// Performing mutation=> CRUD

export const Mutation = new GraphQLObjectType({
  name: "root_mutation",
  fields: {
    addNewStudent: {
      type: StudentInfo,
      args: { input: { type: AddStudentInput } },
      resolve(parent, args) {
        saveNewStudent(args.input);

        return args.input;
      },
    },

    updateStudent:{
        type:StudentInfo,
        args:{input:{ type: AddStudentInput},
    _id:{type:GraphQLString}},

        resolve(parent, args) {
            updateStudentInfo(args._id, args.input);

            return args.input;
        }
    }
  },
});



// Query for students details

export const StudentQuery = new GraphQLObjectType({
  name: "Query",
  fields:{
      allStudent: {
        type: new GraphQLList(StudentInfo),
         resolve(parent: any, args: any) {

          let result =  getAllStudentIds();
          return result;
        },
      },

      getStudent: {
        type: StudentInfo,
        args: {
          studentId: { type: GraphQLInt },
        },
       async resolve(parent: any, args: any) {
          const result = await  getStudentDetails(args.studentId);
          return result;
        },
      },
  
  },
});


export const StudentSchema = new GraphQLSchema({
  query: StudentQuery,
  mutation: Mutation,
});
