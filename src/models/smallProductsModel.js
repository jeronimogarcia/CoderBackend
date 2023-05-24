import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2'

mongoose.pluralize(null);
const collectionProducts = 'smallProducts';

const schema = new mongoose.Schema({
    title: {type: String},
    description: { type: String, required: true },
    price: {type: Number},
    category: { type: String},
    stock: {type: Number}
});
schema.plugin(mongoosePaginate);
const smallPoductModel = mongoose.model(collectionProducts, schema);

export default smallPoductModel;