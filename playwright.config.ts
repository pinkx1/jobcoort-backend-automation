import { APIResponse, defineConfig, expect } from "@playwright/test";
import { ZodTypeAny } from "zod";

expect.extend({
	async toMatchSchema(received: APIResponse, schema: ZodTypeAny) {
		const response = await received.json();
		const result = await schema.safeParseAsync(response);
		if (result.success) {
			return {
				message: () => "schema matched",
				pass: true,
			};
		} else {
			return {
				message: () =>
					"Result does not match schema: " +
					result.error.issues
						.map((issue) => issue.message)
						.join("\n") +
					"\n" +
					"Details: " +
					JSON.stringify(result.error, null, 2),
				pass: false,
			};
		}
	},
});

require("dotenv").config();

export default defineConfig({
	testDir: "src/tests",
	fullyParallel: true,
	reporter: "html",
	use: {
		baseURL: "https://dev.myezjob.com",
		extraHTTPHeaders: {
			"api-token": process.env.API_TOKEN as string,
			"Content-Type": "application/json",
		},
		trace: "retain-on-failure",
	},
	projects: [
		{
			name: "setup",
			testMatch: "tests/*.setup.ts",
		},
		{
			name: "tests",
			testMatch: "tests/*.spec.ts",
			dependencies: ["setup"],
		},
	],
});
