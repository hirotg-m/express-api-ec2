import express, { Request, Response } from 'express';

const app = express();
app.use(express.json());

interface Item {
  id: number;
  [key: string]: unknown;
}

let items: Item[] = [];
let nextId = 1;

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.get('/items', (_req: Request, res: Response) => {
  res.json(items);
});

app.get('/items/:id', (req: Request, res: Response) => {
  const item = items.find(i => i.id === Number(req.params.id));
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});

app.post('/items', (req: Request, res: Response) => {
  const item: Item = { id: nextId++, ...req.body };
  items.push(item);
  res.status(201).json(item);
});

app.put('/items/:id', (req: Request, res: Response) => {
  const idx = items.findIndex(i => i.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  items[idx] = { ...items[idx], ...req.body };
  res.json(items[idx]);
});

app.delete('/items/:id', (req: Request, res: Response) => {
  const idx = items.findIndex(i => i.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  items.splice(idx, 1);
  res.status(204).end();
});

export default app;
