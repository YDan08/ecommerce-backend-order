import { Arg, Mutation, Query, Resolver } from "type-graphql"
import { OrderModel } from "../models"
import { CreateOrderDto } from "../dtos"
import { OrderDb } from "../../db"

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
		data.products.forEach(async product => {
			const endpoint = "http://localhost:4000/"
			const query = `
			mutation Mutation($data: ClaimAvailabilityDto!) {
  			claimAvailability(data: $data) {
    			name
  			}
			}
		`
			const variables = { data: { id: product.idProduct, quantity: product.quantity * -1 } }

			await fetch(endpoint, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ query, variables }),
			})
		})
		const order = await OrderDb.create(data)
		return order
	}
}
