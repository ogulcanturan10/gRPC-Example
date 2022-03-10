const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const packageDef = protoLoader.loadSync("todo.proto",{});
const grpcObject = grpc.loadPackageDefinition(packageDef);//obje olarak package ı aldık
const todoPackage = grpcObject.todoPackage; //to access things in proto file

const server = new grpc.Server();
server.bind("0.0.0.0:40000",/* http2 oldğu için*/ grpc.ServerCredentials.createInsecure());//it can be also ssl

server.addService(todoPackage.Todo.service,{//keyvalue
    "createTodo":createTodo,
    "readTodos" : readTodos,
    "readTodosStream":readTodosStream
});
server.start();
const todos = [];

function createTodo (call,callback) {
    const todoItem = {
        "id": todos.length +1,
        "text": call.request.text    }
    todos.push(call.request);
    callback(null,todoItem);
}

function readTodosStream(call,callback) {
    
    todos.forEach(t => call.write(t));
    call.end();
}

function readTodos (call,callback) {
    callback(null,{"items": todos})
}

