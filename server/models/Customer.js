import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  name: String,
  surname: String,
  iban: { type: String, unique: true, required: true },
  personalCode: { type: String, unique: true, required: true },
  balance: { type: Number, default: 0 },
  passport: String
});

const Customer = mongoose.model('Customer', customerSchema);

export default Customer;