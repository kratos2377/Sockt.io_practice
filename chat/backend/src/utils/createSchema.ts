import { HelloResolver } from "../resolvers/helloresolver";
import { buildSchema } from "type-graphql";
import { UserResolver } from "../resolvers/userResolver";

export const createBuildSchema = async () =>
  buildSchema({
    resolvers: [HelloResolver, UserResolver],
  });
