import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { generateAiContentWithFallback } from './geminiService';

export const apiRouter = Router();

// Rate limiter configuration: 50 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { error: 'Terlalu banyak permintaan, silakan coba lagi nanti.' },
  standardHeaders: true,
  legacyHeaders: false,
});

apiRouter.use(limiter);

apiRouter.post('/generate', async (req, res) => {
  try {
    const { contents, systemInstruction } = req.body;
    if (!contents) return res.status(400).json({ error: 'Contents required' });
    
    const response = await generateAiContentWithFallback(contents, systemInstruction);
    res.json(response);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
});