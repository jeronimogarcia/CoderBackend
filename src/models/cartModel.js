import mongoose from 'mongoose';

mongoose.pluralize(null);
const collectionCarts = 'carts';

const schema = new mongoose.Schema({
    products: {
      type: [{
        product: { type: mongoose.Schema.Types.ObjectId,
        ref: 'smallProducts'
        },
        quantity: { type: Number }
      }],
    }
});

const cartModel = mongoose.model(collectionCarts, schema);

export default cartModel;