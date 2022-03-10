const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const packageDef = protoLoader.loadSync("todo.proto",{});
const grpcObject = grpc.loadPackageDefinition(packageDef);//obje olarak package ı aldık
const todoPackage = grpcObject.todoPackage; //to access things in proto file

const text = process.argv[2]; 

const client = new todoPackage.Todo("localhost:40000",
grpc.credentials.createInsecure()
);

client.createTodo({
    "id":-1,
    "text":text
},(err,response)=>{
    console.log("Received from server "+JSON.stringify(response));
});
/*
client.readTodos({},(err,response) => {

    console.log("read todos from server "+JSON.stringify(response));
    if(!response.items)
          response.items.forEach(i => console.log(i.text));
});
*/

//Hepsini tek seferde birer birer işlememizi sağlıyor.
const call = client.readTodosStream();
call.on("data",item => {
    console.log("received item from stream server " +JSON.stringify(item));
});

call.on("end",e => console.log("server end"));