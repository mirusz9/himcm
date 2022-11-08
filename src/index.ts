import express from 'express';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const port = 6060;
console.log(__dirname);

app.get('/', (req, res) => {
	console.log('response');
	res.sendFile(path.join(__dirname, '../index.html'));
});

app.listen(port, () => {
	console.log(`HiMCM app listening on port ${port}`);
});
