import { Query, Resolver } from "type-graphql";

@Resolver()
export class OrderResolver {

	@Query(() => String)
	async hello() {
		return "hello world"
	}
}