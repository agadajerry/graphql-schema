import createError from "http-errors";
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { graphqlHTTP } from "express-graphql";
import { buildSchema, GraphQLBoolean, GraphQLID, GraphQLInt, GraphQLList } from "graphql";
import { GraphQLSchema, GraphQLObjectType, GraphQLString } from "graphql";

const app = express();

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



// reoslver call

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

const Mutation = new GraphQLObjectType({

  name:"root_mutation",
  fields: {
    addEmployees:{
      type:Employee,
      args: {
        id:{type:GraphQLInt},
        name:{type:GraphQLString}
      },
      resolve(parent:any,args:any){
         assi.employees.push({...args})
         return {...args}
      }
    },
    addEmployee2Department:{
      type:GraphQLBoolean,
      args:{
        employee_id:{type:GraphQLInt},
        department_name:{type:GraphQLString}
      },
      resolve(parent,args){

        const {departments} = assi
        const index = departments.findIndex(dpt=>dpt.name === args.department_name);

        const old_departmentLength = departments.length;

        departments[index].employee_Id.push(args.employee_id);

        const newDepartmentLength = departments[index].employee_Id.length;

       return  old_departmentLength < newDepartmentLength ? true : false;

      }
    }

  }
})


const Schema = new GraphQLSchema({
  query: Query,
  mutation:Mutation
});

//root value

app.use(
  "/graphql",
  graphqlHTTP({
    schema: Schema,
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
