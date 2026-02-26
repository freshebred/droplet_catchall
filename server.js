const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

app.use((req, res, next) => {
    const host = req.headers.host || '';
    const subdomain = host.split('.')[0];

    // Map to the directory: /var/www/catchall/<subdomain>
    const folderPath = path.join(__dirname, subdomain);

    // 1. Check if the directory exists
    if (fs.existsSync(folderPath) && fs.lstatSync(folderPath).isDirectory()) {
        
        // 2. Use express.static to serve the folder dynamically
        // 'index: true' means it still handles the root '/' by looking for index.html
        express.static(folderPath, {
            fallthrough: true, // If file not found in folder, move to next middleware
            index: 'index.html' 
        })(req, res, next);

    } else {
        next(); // Move to the 404 handler below
    }
});

// 3. The Catch-All 404 (If no folder exists OR no file was found in the folder)
app.use((req, res) => {
    res.status(404).send("Page not found - This subdomain is not assigned.");
});

app.listen(3999, () => {
    console.log('Production static-routing server running on port 3999');
});