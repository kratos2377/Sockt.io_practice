import { User } from "../entity/User";
import { Arg, Mutation, Resolver } from "type-graphql";

@Resolver(User)
export class UserResolver {
  @Mutation(() => User, { nullable: true })
  async register(@Arg("username") username: string): Promise<User | null> {
    const user = await User.findOne({ username: username });

    if (user) {
      return null;
    }

    const user1 = await User.create({
      username: username,
    }).save();

    return user1;
  }

  @Mutation(() => Boolean)
  async changeStatus(@Arg("id") id: number): Promise<boolean> {
    const user = await User.findOne({ id: id });

    if (!user) {
      return false;
    }

    await User.update({ id: id }, { status: "online" });

    return true;
  }
}
