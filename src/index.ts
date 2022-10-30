import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 6060;

app.get('/', (req, res) => {
	res.send('Hello HiMCM!');
});

app.listen(port, () => {
	console.log(`HiMCM app listening on port ${port}`);
});
