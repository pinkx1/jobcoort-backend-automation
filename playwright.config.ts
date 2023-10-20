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
	// projects: [
	// 	{
	// 		name: "setup",
	// 		testMatch: "default_acc_auth.setup.ts",
	// 	},
	// 	{
	// 		name: "default user",
	// 		use: { storageState: ".auth/default_user.json" },
	// 		dependencies: ["setup"],
	// 	},
	// ],
});
