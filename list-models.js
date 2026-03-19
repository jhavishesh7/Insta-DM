const fs = require('fs');
const content = fs.readFileSync('models_list.json', 'utf16le');
const data = JSON.parse(content.replace(/^\uFEFF/, '')); // Handle BOM
data.models.forEach(m => console.log(m.name, m.supportedMethods));
