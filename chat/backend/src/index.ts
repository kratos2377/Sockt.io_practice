import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import express from "express";
import "reflect-metadata";
import { Socket } from "socket.io";
import { createBuildSchema } from "./utils/createSchema";
import { createConnection } from "typeorm";
import { availableUsers, onlineUsers, roomValues } from "./globals/global";
import { v4 as uuidv4 } from "uuid";
interface UserDetails {
  username: string;
}

const main = async () => {
  await createConnection();

  const app = express();
  const schema = await createBuildSchema();

  app.use(
    cors({
      origin: [
        "http://localhost:3000",
        "http://localhost:19006",
        "http://10.0.2.2:3000",
      ],
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

  const waitFn = async () => {
    setInterval(() => {}, 500);
  };

  const io = require("socket.io")(server);
  io.on("connection", (socket: Socket) => {
    socket.emit("connected", { socketId: socket.id });

    // socket.emit("details", {
    //   searchingUsersLength: searchingUsers.length,
    //   recievingUsersLength: recievingUsers.length,
    // });

    socket.on("started", (userDetails: UserDetails) => {
      console.log(userDetails);
      availableUsers.set(socket.id, userDetails);
      onlineUsers.push(socket.id);
      console.log(availableUsers);
    });

    socket.on("matching", async () => {
      await waitFn();

      let index = Math.random() * onlineUsers.length;

      let index2 = onlineUsers.indexOf(socket.id);

      const userDetails1 = availableUsers.get(socket.id);
      const userDetails2 = availableUsers.get(onlineUsers[index]);
      const user1id = onlineUsers[index];

      onlineUsers.splice(index, 1);
      onlineUsers.splice(index2, 1);

      console.log("Online Users Value");
      console.log(onlineUsers);

      let roomId = uuidv4();
      console.log("New Room Id");
      console.log(roomId);
      roomValues.set(roomId, { userSocket1: socket.id, userSocket2: user1id });

      socket.to(socket.id).emit("userDetails", { deatils: userDetails2 });
      socket.to(user1id).emit("userDetails", { deatails: userDetails1 });
    });

    socket.on("next-user", () => {
      onlineUsers.push(socket.id);
    });

    socket.on("cancel-room", (roomID: string) => {
      roomValues.delete(roomID);
    });

    socket.on("disconnect", () => {
      let index = onlineUsers.indexOf(socket.id);

      onlineUsers.splice(index, 1);

      availableUsers.delete(socket.id);
    });
  });
};

main().catch((error) => console.log(error));
