import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import express from "express";
import "reflect-metadata";
import { Socket } from "socket.io";
import http from "http";
import { createBuildSchema } from "./utils/createSchema";

const main = async () => {
  const app = express();
  const httpServer = http.createServer(app);
  const schema = await createBuildSchema();

  app.use(
    cors({
      origin: "http://localhost:3000",
      methods: "GET",
    })
  );

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }: any) => ({
      req,
      res,
    }),
  });

  apolloServer.applyMiddleware({ app });

  httpServer.listen(5000, () => console.log("Server Started at Port 5000"));
  const io = require("socket.io")(httpServer);
  console.log("Socket Started");
  io.on("connection", (socket: Socket) => {
    console.log(socket);
    socket.emit("step", "Chat Here");
  });
};

main().catch((error) => console.log(error));
