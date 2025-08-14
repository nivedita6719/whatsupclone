
const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('✅ Hello from Test Backend'));

const PORT = 8080; // change to 5000 if needed
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Test server running on http://localhost:${PORT}`);
});
