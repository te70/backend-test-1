const express = require('express');
const bodyParser = require('body-parser');
const bRoutes = require('./routes/bRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use('/api/blog', bRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})