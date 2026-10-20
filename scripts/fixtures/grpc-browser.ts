import * as grpc from "@grpc/grpc-js";
import { compileGrpcSchema } from "../../src/lib/grpc-proto";
const files = [{ name: "echo.proto", source: 'syntax="proto3"; package example; message EchoRequest { string message=1; } message EchoReply { string message=1; } service Echo { rpc Say(EchoRequest)returns(EchoReply); rpc Watch(EchoRequest)returns(stream EchoReply); rpc Collect(stream EchoRequest)returns(EchoReply); rpc Chat(stream EchoRequest)returns(stream EchoReply); }' }];
type Message = { message: string };
const server = new grpc.Server(), schema = compileGrpcSchema(files);
server.addService(schema.definition["example.Echo"] as grpc.ServiceDefinition, {
    Say(call: grpc.ServerUnaryCall<Message, Message>, callback: grpc.sendUnaryData<Message>) { callback(null, call.request); },
    Watch(call: grpc.ServerWritableStream<Message, Message>) { for (let i = 1; i <= 3; i++) call.write({ message: call.request.message + " " + i }); call.end(); },
    Collect(call: grpc.ServerReadableStream<Message, Message>, callback: grpc.sendUnaryData<Message>) { const messages: string[] = []; call.on("data", (message: Message) => messages.push(message.message)); call.on("end", () => callback(null, { message: messages.join(" | ") })); },
    Chat(call: grpc.ServerDuplexStream<Message, Message>) { call.on("data", (message: Message) => call.write(message)); call.on("end", () => call.end()); },
});
server.bindAsync("127.0.0.1:0", grpc.ServerCredentials.createInsecure(), (error, port) => { if (error) throw error; console.log("Owned public gRPC browser fixture on 127.0.0.1:" + port); });
process.once("SIGINT", () => { server.forceShutdown(); process.exit(); });
process.once("SIGTERM", () => { server.forceShutdown(); process.exit(); });
