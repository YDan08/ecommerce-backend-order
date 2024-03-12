import { Arg, Mutation, Query, Resolver } from "type-graphql"
import { OrderModel } from "../models"
import { CreateOrderDto } from "../dtos"
import { OrderDb } from "../../db"
import client, { Channel, Connection } from "amqplib"

@Resolver(() => OrderModel)
export class OrderResolver {
	@Query(() => [OrderModel])
	async listOrder() {
		const orders = await OrderDb.find()
		return orders
	}

	@Query(() => OrderModel)
	async findOrder(@Arg("id", () => String) id: string) {
		const order = await OrderDb.findById(id)
		return order
	}

	@Mutation(() => OrderModel)
	async createOrder(@Arg("data", () => CreateOrderDto) data: CreateOrderDto) {
		const products = await Promise.all(
			data.products.map(async product => {
				const endpoint = "http://localhost:4000/"
				const query = `
			mutation Mutation($data: ClaimAvailabilityDto!) {
  			claimAvailability(data: $data) {
    			name
					quantity
  			}
			}
		`
				const variables = {
					data: { id: product.idProduct, quantity: product.quantity * -1 },
				}

				const item = await fetch(endpoint, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ query, variables }),
				})
				const itemFilter = await item.json()

				if (itemFilter) {
					return {
						name: itemFilter.data.claimAvailability.name,
						quantity: product.quantity,
					}
				}
			})
		)

		const order = await OrderDb.create(data)

		const server: Connection = await client.connect(`${process.env.RABBITMQ_SERVER}`)
		const channel: Channel = await server.createChannel()
		await channel.assertExchange("topic_orders", "topic")
		await channel.publish(
			"topic_orders",
			"order.placed",
			Buffer.from(JSON.stringify({ id: order.id, email: order.email, products }))
		)

		return order
	}
}
