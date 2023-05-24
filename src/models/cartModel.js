import mongoose from 'mongoose';

mongoose.pluralize(null);
const collectionCarts = 'carts';

const schema = new mongoose.Schema({
    products: {
      type: [{
        id: { type: String },
        quantity: { type: Number }
      }],
    }
});

const cartModel = mongoose.model(collectionCarts, schema);

export default cartModel;