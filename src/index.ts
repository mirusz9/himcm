import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.get('/', (req, res) => {
	res.send('Hello HiMCM!');
});

app.listen(process.env.PORT, () => {
	console.log(`HiMCM app listening on port ${process.env.PORT}`);
});
