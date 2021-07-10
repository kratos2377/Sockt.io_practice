import { User } from "../entity/User";
import { Arg, Mutation, Resolver } from "type-graphql";

@Resolver(User)
export class UserResolver {
  @Mutation(() => Boolean)
  async register(@Arg("username") username: string): Promise<boolean> {
    if (username.length < 8) {
      return false;
    }

    const user = await User.findOne({ username: username });

    if (user) {
      return false;
    }

    await User.create({
      username: username,
    }).save();

    return true;
  }
}
