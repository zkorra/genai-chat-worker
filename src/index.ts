import { Hono } from 'hono';
import { cors } from 'hono/cors';

import api from './api';

const app = new Hono();
app.use('/api/*', cors());

app.notFound((c) => c.json({ error: 'Not Found' }, 404));

app.route('/api', api);

export default app;
