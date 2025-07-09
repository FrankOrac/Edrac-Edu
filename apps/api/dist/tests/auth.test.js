"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Mock /auth/register endpoint for test
app.post('/auth/register', (req, res) => {
    const { email, password } = req.body;
    if (email && password)
        return res.status(200).json({ id: 1, email });
    res.status(400).json({ error: 'Email and password required' });
});
describe('POST /auth/register', () => {
    it('should register a user with email and password', async () => {
        const res = await (0, supertest_1.default)(app)
            .post('/auth/register')
            .send({ email: 'test@example.com', password: 'secret' });
        expect(res.statusCode).toBe(200);
        expect(res.body.email).toBe('test@example.com');
    });
});
