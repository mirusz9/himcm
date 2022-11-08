import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
dotenv.config();
const app = express();
const port = 6060;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(cors());
app.use(express.static(path.join(__dirname, '../dist')));
console.log(__dirname);
app.get('/', (req, res) => {
    console.log('response');
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});
app.listen(port, () => {
    console.log(`HiMCM app listening on port ${port}`);
});
