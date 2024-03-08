import { Field, ObjectType } from "type-graphql"

@ObjectType()
export class ProductOrder {
	@Field(() => String)
	idProduct: string

	@Field(() => Number)
	quantity: number
}

@ObjectType()
export class OrderModel {
	@Field(() => [ProductOrder])
	products: ProductOrder[]
}
