import mongoose from 'mongoose';

mongoose.pluralize(null);
const collectionProducts = 'smallProducts';

const schema = new mongoose.Schema({
    title: {type: String},
    description: { type: String, required: true },
    price: {type: Number},
    category: { type: String},
    stock: {type: Number}
});

const smallPoductModel = mongoose.model(collectionProducts, schema);

export default smallPoductModel;