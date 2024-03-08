import { Type } from "class-transformer"
import { IsArray, IsNumber, IsString } from "class-validator"
import { Field, InputType } from "type-graphql"

@InputType("ProductOrderDto")
export class ProductOrderDto {
	@IsString()
	@Field(() => String)
	idProduct: string

	@IsNumber()
	@Field(() => Number)
	quantity: number
}

@InputType()
export class CreateOrderDto {
	@Field(() => [ProductOrderDto], { defaultValue: [] })
	@IsArray()
	@Type(() => ProductOrderDto)
	products: ProductOrderDto[]
}
