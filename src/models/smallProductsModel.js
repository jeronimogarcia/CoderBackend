import mongoose from 'mongoose';

mongoose.pluralize(null);
const collectionProducts = 'smallProducts';

const schema = new mongoose.Schema({
    id: Number,
    title: String,
    description: { type: String, required: true },
    price: Number,
    category: String,
    stock: Number
});

const smallPoductModel = mongoose.model(collectionProducts, schema);

export default smallPoductModel;