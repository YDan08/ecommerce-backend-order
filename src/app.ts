import "reflect-metadata"
import { config } from "dotenv"
import { buildSchema } from "type-graphql"
import { ApolloServer } from "apollo-server"
import { OrderResolver } from "./order"

export const bootstrap = async () => {
	config()

	const schema = await buildSchema({
		resolvers: [OrderResolver],
	})

	const server = new ApolloServer({
		schema,
	})

	const { url } = await server.listen(process.env.PORT || 4001)

	console.log(`Server running on ${url}`)
}

bootstrap()
