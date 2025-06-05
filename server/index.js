import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import Customer from './models/Customer.js';

try {
    await mongoose.connect('mongodb://127.0.0.1:27017/virtual-bank');
    console.log('Connected to database');
} catch {
    console.log('Unable to reach database service');
}

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

// For file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Get all customers
app.get('/api/customers', async (req, res) => {
  const customers = await Customer.find();
  res.json(customers);
});

// Helper to generate a random unique LT IBAN
async function generateIBAN() {
  let iban;
  let exists = true;
  while (exists) {
    // Example: LT + 2 check digits + 16 random digits
    const randomDigits = Array.from({ length: 16 }, () => Math.floor(Math.random() * 10)).join('');
    iban = `LT${Math.floor(10 + Math.random() * 90)}${randomDigits}`;
    exists = await Customer.exists({ iban });
  }
  return iban;
}

// Add new customer
app.post('/api/customers', upload.single('passport'), async (req, res) => {
  try {
    const { name, surname, idCode } = req.body;
    const passport = req.file ? req.file.buffer.toString('base64') : null;
    const iban = await generateIBAN();
    const customer = new Customer({ name, surname, iban, personalCode, passport });
    await customer.save();
    res.json(customer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete customer
app.delete('/api/customers/:id', async (req, res) => {
  await Customer.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

app.listen(3001, () => console.log('Server is running'));