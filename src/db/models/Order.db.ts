import mongoose from "mongoose"

export interface ProductOrder {
	idProduct: string
	quantity: number
}

interface Order {
	email: string
	products: ProductOrder[]
}

const { Schema } = mongoose

export const productOrderSchema = new Schema<ProductOrder>({
	idProduct: String,
	quantity: Number,
})

export const orderSchema = new Schema<Order>(
	{
		email: {
			type: String,
			required: true,
		},
		products: {
			type: [productOrderSchema],
			required: true,
		},
	},
	{ timestamps: true }
)

export const OrderDb = mongoose.model<Order>("orders", orderSchema)
