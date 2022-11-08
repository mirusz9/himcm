"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = 6060;
console.log(__dirname);
app.get('/', (req, res) => {
    console.log('response');
    res.sendFile(path_1.default.join(__dirname, '../index.html'));
});
app.listen(port, () => {
    console.log(`HiMCM app listening on port ${port}`);
});
