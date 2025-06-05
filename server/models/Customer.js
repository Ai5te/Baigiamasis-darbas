import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  name: String,
  surname: String,
  iban: { type: String, unique: true, required: true },
  personalCode: String,
  balance: { type: Number, default: 0 },
  passport: String // store file path or base64 string
});

const Customer = mongoose.model('Customer', customerSchema);

export default Customer;