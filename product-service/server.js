const express = require('express');
const client = require('prom-client');

const app = express();

const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequestCounter = new client.Counter({
  name: 'product_service_http_requests_total',
  help: 'Total HTTP requests to product service',
  labelNames: ['method', 'route', 'status']
});

register.registerMetric(httpRequestCounter);

app.use((req, res, next) => {
  res.on('finish', () => {
    httpRequestCounter.inc({
      method: req.method,
      route: req.path,
      status: res.statusCode
    });
  });
  next();
});

app.get('/', (req, res) => {
  res.send('Product Service Running - GitOps Success');
});

app.get('/products', (req, res) => {
  res.json([
    { id: 1, name: 'iPhone 15', price: 80000 },
    { id: 2, name: 'Samsung S24', price: 70000 }
  ]);
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.listen(5000, () => {
  console.log('Product Service running on port 5000');
});
