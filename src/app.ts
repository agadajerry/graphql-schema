import createError from "http-errors";
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { graphqlHTTP } from "express-graphql";
import { buildSchema, GraphQLBoolean, GraphQLID, GraphQLInputObjectType, GraphQLInt, GraphQLList } from "graphql";
import { GraphQLSchema, GraphQLObjectType, GraphQLString } from "graphql";
import connect from "./db-config/mongo-connection"
import {StudentSchema,StudentQuery} from "./studentDetails"
const app = express();


//connect to db
connect();

// view engine setup
app.set("views", path.join(__dirname, ".././views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//graphql here

const assi = {
  company: "name",
  employees: [
    {
      id: 1,
      name: "yo",
    },
  ],
  departments: [
    {
      name: "Engineering",
      noofEmployees: 4,
      employee_Id: [1, 2, 3, 4],
      manager: 1,
    },
  ],
};

// Schema for graphqlObject

//employee schema

const Employee = new GraphQLObjectType({
  name: "Employee_type",
  fields: () => {
    return {
      id: { type: GraphQLInt },
      name: { type: GraphQLString },
    };
  },
});

// department schema
const Department = new GraphQLObjectType({
  name: "Department_type",
  fields: () => {
    return {
      name: { type: GraphQLString },
      noofEmployees: { type: GraphQLInt },
      employee_Id: { type: new GraphQLList(GraphQLInt) },
      manager: { type: GraphQLInt },
    };
  },
});

// Company name

const Company = new GraphQLObjectType({
  name: "Company_type",
  fields: () => {
    return {
      Company: { type: GraphQLString },
      employees: { type: new GraphQLList(Employee) },
      departments: { type: new GraphQLList(Department) },
    };
  },
});




// resolver call

const Query = new GraphQLObjectType({
  name: "query_type",
  fields: {
    Company: {
      type: Company,
      resolve(parents: any, args: any) {
        return assi;
      },
    },
    getSingleDepartment:{
      type: Company,
      args: {
        department_name:{type:GraphQLString}
      },
      resolve(parents, args) {

        const {departments} = assi; // get only the department from the object by distructuring
        const deptName = departments.find(cmp=>cmp.name === args.department_name);
        
        return {...args}
      }
    }
  },
});

// Mutation for a given fields

// input field for args

const addEmployeeIdToDpt = new GraphQLInputObjectType({
  name:"input_field_employee",
  fields:{
    id:{type:GraphQLInt},
    name:{type:GraphQLString}
  }
})
const Mutation = new GraphQLObjectType({

  name:"root_mutation",
  fields: {
    addEmployees:{
      type:Employee,
      args: {input:{type:addEmployeeIdToDpt}},
      resolve(parent:any,args:any){
         assi.employees.push({...args.input})
         return {...args.input}
      }
    },

    addEmployeeToDepartment:{
      type: GraphQLBoolean,
      args:{
        empID:{type:GraphQLInt},
        department_name:{type:GraphQLString},
      },
      resolve(parent:any,args:any){
          
        const {departments} = assi;
        
        
        let indexOfDepartment =  departments.findIndex(dpt=>dpt.name === args.department_name);
        
        let numOfEmployees = departments[indexOfDepartment].employee_Id.length;
        console.log(numOfEmployees);

        // add new employee id to department
        departments[indexOfDepartment].employee_Id.push(args.empID);
        
        const newNumOfEmployees = departments[indexOfDepartment].employee_Id.length
        console.log(newNumOfEmployees);

         return numOfEmployees < newNumOfEmployees ? true : false;
      }
    }
  }
})


const Schema = new GraphQLSchema({
  query: StudentQuery,
  mutation:Mutation
});

//root value

app.use(
  "/graphql",
  graphqlHTTP({
    schema: StudentSchema,
    graphiql: true,
  })
);

// catch 404 and forward to error handler
app.use(function (req: Request, res: Response, next: NextFunction) {
  next(createError(404));
});

// error handler
app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

const port: number = 3000;
app.listen(port, () => {
  console.log("Server running on port 3000");
});
