import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import express from "express";
import "reflect-metadata";
import { Socket } from "socket.io";
import { createBuildSchema } from "./utils/createSchema";
import { createConnection } from "typeorm";

const main = async () => {
  await createConnection();

  const app = express();
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

  const server = app.listen(5000, () =>
    console.log("Server Started at Port 5000")
  );
  const io = require("socket.io")(server);
  io.on("connection", (socket: Socket) => {
    console.log("Socket Started");
    socket.emit("start", socket.id);
  });
};

main().catch((error) => console.log(error));
