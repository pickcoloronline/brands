const fs = require('fs');
const path = require('path');

const folderPath = '.'; // Replace with the path to your folder

// Function to update keys in a single JSON object
function updateKeys(json) {
    const updatedJson = {};
    for (const key in json) {
        if (Object.prototype.hasOwnProperty.call(json, key)) {
            let newKey = key;
            if (key === 'brand_url') newKey = 'brandUrl';
            if (key === 'source_url') newKey = 'sourceUrl';
            updatedJson[newKey] = json[key];
        }
    }
    return updatedJson;
}

// Function to process all JSON files in the folder
function processFiles() {
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }

        files.forEach(file => {
            const filePath = path.join(folderPath, file);

            // Process only .json files
            if (path.extname(file) === '.json') {
                fs.readFile(filePath, 'utf8', (err, data) => {
                    if (err) {
                        console.error('Error reading file:', err);
                        return;
                    }

                    try {
                        const json = JSON.parse(data);
                        const updatedJson = updateKeys(json);

                        fs.writeFile(filePath, JSON.stringify(updatedJson, null, 2), 'utf8', err => {
                            if (err) {
                                console.error('Error writing file:', err);
                                return;
                            }
                            console.log(`Updated: ${file}`);
                        });
                    } catch (parseError) {
                        console.error(`Error parsing JSON in file: ${file}`, parseError);
                    }
                });
            }
        });
    });
}

// Run the script
processFiles();
