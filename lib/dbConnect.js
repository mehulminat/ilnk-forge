import mongoose from "mongoose";

const MONGODB_URI = process.env.mongodburl

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside next.config js file'
  )
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 */
let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect () {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then(mongoose => {
      return mongoose
    })
  }
  cached.conn = await cached.promise
  return cached.conn
}

export default dbConnect
