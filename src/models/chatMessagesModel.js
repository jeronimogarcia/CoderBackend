import mongoose from 'mongoose';

mongoose.pluralize(null);
const collectionMessages = 'chatMessages';

const schema = new mongoose.Schema({
    email: {type: String},
    msg: { type: String, required: true },
    created: { type: Date }
});

const chatMessagesModel = mongoose.model(collectionMessages, schema);

export default chatMessagesModel;