import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.get('/', (req, res) => {
	res.send('Hello HiMCM!');
});

app.listen(6000, () => {
	console.log(`HiMCM app listening on port ${6000}`);
});
