import path from "path";
import { createGenerator } from "ts-json-schema-generator";
const fs = require("fs");

const config = {
    path: path.join(__dirname, '../../shared/types/*.ts'),
    tsconfig: path.join(__dirname, '../../../tsconfig.json')
};

const schema = createGenerator(config).createSchema('*');

const schemaString = JSON.stringify(schema, null, 2);
fs.writeFile(path.join(__dirname, '../../../dist/schema.json'), schemaString, (err:any) => {
    if (err) throw err;
});
