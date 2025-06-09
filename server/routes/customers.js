import express from 'express';
import Customer from '../models/Customer.js';
import upload from '../middleware/upload.js';

function isValidPersonalCode(code) {
  if (!/^\d{11}$/.test(code)) return false;
  const first = parseInt(code[0], 10);
  if (first < 1 || first > 6) return false;
  const yearBase = [null, 1800, 1800, 1900, 1900, 2000, 2000][first];
  const year = yearBase + parseInt(code.slice(1, 3), 10);
  const month = parseInt(code.slice(3, 5), 10);
  const day = parseInt(code.slice(5, 7), 10);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return false;
  }
  const digits = code.split('').map(Number);
  const k1 = [1,2,3,4,5,6,7,8,9,1];
  const k2 = [3,4,5,6,7,8,9,1,2,3];
  let sum1 = 0, sum2 = 0;
  for (let i = 0; i < 10; i++) {
    sum1 += digits[i] * k1[i];
    sum2 += digits[i] * k2[i];
  }
  let control = sum1 % 11;
  if (control === 10) control = sum2 % 11;
  if (control === 10) control = 0;
  return control === digits[10];
}

async function generateIBAN() {
  let iban;
  let exists = true;
  while (exists) {
    const randomDigits = Array.from({ length: 16 }, () => Math.floor(Math.random() * 10)).join('');
    iban = `LT${Math.floor(10 + Math.random() * 90)}${randomDigits}`;
    exists = await Customer.exists({ iban });
  }
  return iban;
}

const router = express.Router();

router.get('/', async (req, res) => {
  const customers = await Customer.find();
  res.json(customers);
});

router.post('/', upload.single('passport'), async (req, res) => {
  try {
    const { name, surname, personalCode } = req.body;
    if (!isValidPersonalCode(personalCode)) {
      return res.status(400).json({ error: 'Invalid personal code.' });
    }
    const exists = await Customer.exists({ personalCode });
    if (exists) {
      return res.status(400).json({ error: 'Personal code already exists.' });
    }
    let passport = null;
    let passportPath = null;
    if (req.file) {
      passportPath = req.file.path;
      passport = req.file.buffer ? req.file.buffer.toString('base64') : null;
    }
    const iban = await generateIBAN();
    const customer = new Customer({ name, surname, iban, personalCode, passport, passportPath });
    await customer.save();
    res.json(customer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) {
    return res.status(404).json({ error: "Customer not found." });
  }
  if (customer.balance !== 0) {
    return res.status(400).json({ error: "Cannot delete account with non-zero balance." });
  }
  await Customer.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

router.patch('/:id/deposit', async (req, res) => {
  const { amount } = req.body;
  if (!amount || isNaN(amount) || Number(amount) <= 0) {
    return res.status(400).json({ error: "Invalid amount." });
  }
  const customer = await Customer.findById(req.params.id);
  if (!customer) return res.status(404).json({ error: "Customer not found." });
  customer.balance += Number(amount);
  await customer.save();
  res.json(customer);
});

router.patch('/:id/withdraw', async (req, res) => {
  const { amount } = req.body;
  if (!amount || isNaN(amount) || Number(amount) <= 0) {
    return res.status(400).json({ error: "Invalid amount." });
  }
  const customer = await Customer.findById(req.params.id);
  if (!customer) return res.status(404).json({ error: "Customer not found." });
  if (customer.balance < Number(amount)) {
    return res.status(400).json({ error: "Insufficient funds." });
  }
  customer.balance -= Number(amount);
  await customer.save();
  res.json(customer);
});

router.patch('/:id', async (req, res) => {
  try {
    const { name, surname } = req.body;
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ error: "Customer not found." });
    customer.name = name;
    customer.surname = surname;
    await customer.save();
    res.json(customer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
