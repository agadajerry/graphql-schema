import createError from "http-errors";
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
import {organSchema,addEmploye,addDepartment}from "./organisationSchema"




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


// Sample users
var users = [
  {
    id: 1,
    name: 'Brian',
    age: '21',
    shark: 'Great White Shark'
  },
  {
    id: 2,
    name: 'Kim',
    age: '22',
    shark: 'Whale Shark'
  },
  {
    id: 3,
    name: 'Faith',
    age: '23',
    shark: 'Hammerhead Shark'
  },
  {
    id: 4,
    name: 'Joseph',
    age: '23',
    shark: 'Tiger Shark'
  },
  {
    id: 5,
    name: 'Joy',
    age: '25',
    shark: 'Hammerhead Shark'
  }
];



const schema  = buildSchema(`
type Query {
  user(id:Int) :Person
  users(shark :String): [Person]
}

type Mutation {
  updateUser(id:Int!, name:String!, age:Int):Person
}


type Person{
  id:Int!
  name:String,
  age:Int
  shark : String
}


`)




//get user

const getUsers = (args:any)=>{

  const userId = args.id

  return users.filter((user:any)=>user.id === userId)[0];
}


//retrive users
//check for shark if exist
const retriveUser = (args:any)=>{

  if(args.shark){
    var shark = args.shark;

    return users.filter((user:any)=>user.shark === shark)
  }else{
    return users
  }
}

// update user

let updateUser = (id:any, name:string, age:number)=>{

 users.map((user:any)=>{
    if(user.id === id){
      user.name = name;
      user.age = age;
      return user
    }
  });

  return users.filter((use:any)=>use.id === id)[0]
}


//root value
const root = {
  user:getUsers,
  users:retriveUser,
  updateUser:updateUser,
  addEmployee:addEmploye,
  departments:addDepartment
  
 
}

//root value



app.use("/graphql", graphqlHTTP({
  schema:organSchema,
  rootValue:root,
  graphiql:true
 
}))

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

const port:number = 3000
app.listen(port, ()=>{
  console.log("Server running on port 3000")
})
// export default app;









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
