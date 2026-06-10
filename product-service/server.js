const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send('Product Service Running - ArgoCD GitOps Demo');
});

app.get('/products', (req, res) => {
    res.json([
        { id: 1, name: 'iPhone 15', price: 80000 },
        { id: 2, name: 'Samsung S24', price: 70000 }
    ]);
});

app.listen(5000, () => {
    console.log('Product Service running on port 5000');
});
