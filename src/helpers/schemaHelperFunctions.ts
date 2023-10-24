import { createSchema, areSchemasEqual } from "genson-js";
import fs from "fs";

function getSchemaFromJson(json: object) {
	let schemaObj = createSchema(json);
	return schemaObj;
}

async function createJsonSchema(name: string, path: string, json: object) {
	console.log("This is the body that's being converted to json\n" + JSON.stringify(json, null, 2));
	let filePath = "./.api/" + path;
	if (!fs.existsSync(filePath)) {
		fs.mkdirSync(filePath, { recursive: true });
	}

	let schema = createSchema(json);
	let schemaString: string = JSON.stringify(schema);
	let schemaName = ".api/" + path + "/" + name + "_schema.json";

	writeJsonFile(schemaName, schemaString);
}

async function writeJsonFile(location: string, data: string) {
	try {
		fs.writeFileSync(location, data);
	} catch (err) {
		console.error(err);
	}
}

function schemaEqual(schema: any, target: any) {
	areSchemasEqual(schema, target, { ignoreRequired: false });
}

export { getSchemaFromJson, createJsonSchema, schemaEqual };
