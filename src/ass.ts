import createError from "http-errors";
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";

const app = express();

// view engine setup
app.set("views", path.join(__dirname, ".././views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const schema = buildSchema(`

type Query{
employee(id:Int):Employee
}

type Department{
name: String,
noofEmployees: Int
employee_Id: [Int]
manager: Int
}

type Employee{
id:Int
name:String
}

input addEmployeeInput{
name:String
}

input addDepartmentInput{
name: String,
noofEmployees: Int,
employee_Id: [Int],
manager: Int
}






type Mutation {
addEmployee(input:addEmployeeInput):[Employee]
departments(input: addDepartmentInput):[Department]
}

 

`);
//query
let getEmployee = (args: any) => {
  let empId = args.id;

  return employeeDb.find((emp: any) => emp.id === empId);
};

let employeeDb = [
  {
    id: 1,
    name: "yo",
  },
];


// Department Db

let departments = [
  {
    name: "Engineering",
    noofEmployees: 4,
    employee_Id: [1, 2, 3, 4],
    manager: 1,
  },
];

//add employee
class NewEmployee {
  name: string;
  id: number;

  constructor(name: string, id: number) {
    this.name = name;
    this.id = id;
  }
}

let addEmploye = ({ input }: { input: any }) => {
  const { name } = input;

  let id = employeeDb.length;

  let newemp = new NewEmployee(name, id + 1);
  console.log(newemp);
  employeeDb.push(newemp);

  return employeeDb;
};

//add department

class NewDepartment {
  name: string;
  noofEmployees: number;
  employee_Id: [number];
  manager: number;

  constructor(
    name: string,
    noofEmployees: number,
    manager: number,
    employee_Id: [number]
  ) {
    this.employee_Id = employee_Id;
    this.name = name;
    this.noofEmployees = noofEmployees;
    this.manager = manager;
  }
}

let addDepartment = ({ input }: { input: any }) => {
  const { name, noofEmployees, manager, employee_Id } = input;

  let newDpt = new NewDepartment(name, noofEmployees, manager, employee_Id);

  departments.push(newDpt);
  return departments;
};




//root value
const root = {
  addEmployee: addEmploye,
  employee: getEmployee,
  departments: addDepartment,
};

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

// app.use("/", indexRouter);
// app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
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

module.exports = app;

/**
 * query getSingleUser($userAId:Int, $userBId:Int){
  
  userA:user(id:$userAId){
    ... userFields
  },
  
   userB:user(id:$userBId){
    ... userFields
  }
}

  fragment userFields on Person{
    name
    age
    shark
  }
  
  
  query getUsers($shark:String, $age: Boolean!, $id:Boolean!){
    
    users(shark:$shark){
      ...userFields2
    }
  }

  fragment userFields2 on Person{
    name
  age @include(if : $age)
   id @include(if : $id)
  }
  
  

  # Update user

mutation updateUser($id:Int!, $name:String!, $age:Int){
  
  updateUser(id:$id,name:$name,age:$age){
    
    ...userFields3
  }
}

fragment userFields3 on Person{
  name
  age
  shark
}
 */
