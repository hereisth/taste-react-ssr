const express = require('express');
const fs = require('fs');
const path = require('path');
require('esbuild-register');

const app = express();
const PORT = 3000;

app.use(express.static('.'));
app.use('/dist', express.static('dist'));

app.get('/', (req, res) => {

  try {
    const render = require('../src/server.jsx').default;
    const ssrContent = render();

    const template = fs.readFileSync(path.join(__dirname, '../template.html'), 'utf-8');
    const html = template.replace('{{SSR_CONTENT}}', ssrContent);

    res.send(html);
  } catch (error) {
    console.error('Error rendering SSR:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});