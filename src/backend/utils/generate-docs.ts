import path from "path";
import { createGenerator } from "ts-json-schema-generator";
const fs = require("fs");

const config = {
    path: path.join(__dirname, '../../shared/types/*.ts'),
    tsconfig: path.join(__dirname, '../../../tsconfig.json')
};

const schema = createGenerator(config).createSchema('*');
const distDirectory = path.join(__dirname, '../../../dist')
if (!fs.existsSync(distDirectory)) {
    fs.mkdirSync(distDirectory);
}
const schemaString = JSON.stringify(schema, null, 2);
fs.writeFile(distDirectory + '/schema.json', schemaString, (err: any) => {
    if (err) throw err;
});
