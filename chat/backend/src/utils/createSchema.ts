import { HelloResolver } from "../resolvers/helloresolver";
import { buildSchema } from "type-graphql";

export const createBuildSchema = async () =>
  buildSchema({
    resolvers: [HelloResolver],
  });
