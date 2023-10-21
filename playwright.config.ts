import { defineConfig } from "@playwright/test";

require("dotenv").config();

export default defineConfig({
	testDir: "./tests",
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
