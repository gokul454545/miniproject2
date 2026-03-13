const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Path to models directory
const modelsPath = path.join(__dirname, '../models');

// Load all models
fs.readdirSync(modelsPath).forEach(file => {
    if (file.endsWith('.js')) {
        require(path.join(modelsPath, file));
    }
});

function getMongooseType(pathType) {
    if (pathType.instance) return pathType.instance;
    if (pathType.options && pathType.options.type) {
        if (Array.isArray(pathType.options.type)) return 'Array';
        if (pathType.options.type.name) return pathType.options.type.name;
    }
    return 'Unknown';
}


let diagram = 'classDiagram\n';

const models = mongoose.modelNames();

models.forEach(modelName => {
    const model = mongoose.model(modelName);
    const schema = model.schema;

    diagram += `    class ${modelName} {\n`;

    schema.eachPath((pathname, schemaType) => {
        if (pathname === '__v') return;

        const typeName = getMongooseType(schemaType);
        diagram += `        +${typeName} ${pathname}\n`;
    });
    diagram += `    }\n`;

    // Relationships
    schema.eachPath((pathname, schemaType) => {
        if (schemaType.options && schemaType.options.ref) {
            diagram += `    ${modelName} --> ${schemaType.options.ref} : ${pathname}\n`;
        }
    });
});

const outputPath = path.join(__dirname, '../db-schema.mmd');
fs.writeFileSync(outputPath, diagram);
console.log(`Database diagram generated at: ${outputPath}`);

