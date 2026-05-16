import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import authRouter from './routes/auth.js';
const app = express();
const PORT = process.env.PORT || 3000;
const corsOptions = {
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200,
    credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use('/auth', authRouter);
app.use((err, _req, res, _next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal Server Error" });
});
app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map