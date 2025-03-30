const express = require('express');
const app = express();
const port = 3001;

app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Teste Servidor</title>
      </head>
      <body>
        <h1>Servidor de Teste</h1>
        <p>Se você está vendo esta página, o servidor Express está funcionando corretamente.</p>
      </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
