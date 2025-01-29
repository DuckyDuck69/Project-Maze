// server.js
const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// Handle the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'mazeIndex.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});