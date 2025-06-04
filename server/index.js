import express from 'express';
import mongoose from 'mongoose';

try {
    await mongoose.connect('mongodb://127.0.0.1:27017/virtual-bank');
    console.log('Connected to database');
} catch {
    console.log('Unable to reach database service');
}

const app = express();

app.use(express.urlencoded());

app.get('/', (req, res) => {
    res.json('Hello, World!');
});

app.post('/', (req, res) => {
    console.log(req.body);
    res.json(req.body);
});

app.listen(3001, () => console.log('Server is running'));