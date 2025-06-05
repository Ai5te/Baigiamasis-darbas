// import express from 'express';
// import mongoose from 'mongoose';
// import cors from 'cors';
// import multer from 'multer';
// import Customer from './models/Customer.js';

// const app = express();
// app.use(cors());
// app.use(express.json());

// // For file uploads
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// mongoose.connect('mongodb://127.0.0.1:27017/virtual-bank');

// // Get all customers
// app.get('/api/customers', async (req, res) => {
//   const customers = await Customer.find();
//   res.json(customers);
// });

// // Add new customer
// app.post('/api/customers', upload.single('passport'), async (req, res) => {
//   const { name, surname, iban, idCode } = req.body;
//   const passport = req.file ? req.file.buffer.toString('base64') : null;
//   const customer = new Customer({ name, surname, iban, idCode, passport });
//   await customer.save();
//   res.json(customer);
// });

// // Delete customer
// app.delete('/api/customers/:id', async (req, res) => {
//   await Customer.findByIdAndDelete(req.params.id);
//   res.json({ success: true });
// });

// app.listen(3001, () => console.log('Server running on port 3001'));