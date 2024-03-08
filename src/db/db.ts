import mongoose from "mongoose"

export const db = async () => {
	try {
		await mongoose.connect(`${process.env.DATABASE_URL}`)
		console.log("conectado no mongoose")
	} catch (error) {
		console.log(error)
	}
}

export default db
