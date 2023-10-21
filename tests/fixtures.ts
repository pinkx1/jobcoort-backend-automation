import { test as baseTest, APIRequestContext, request } from "@playwright/test";

export const test = baseTest.extend<{
	defaultUser: APIRequestContext;
	candidateUser: APIRequestContext;
}>({
	defaultUser: async ({}, use) => {
		const context = await request.newContext({
			extraHTTPHeaders: { "auth-token": `Bearer ${process.env.CANDIDATE_ACC_AUTH_TOKEN}`, "api-token": process.env.API_TOKEN as string, "Content-Type": "application/json" },
		});
		await use(context);
		await context.dispose();
	},

	candidateUser: async ({}, use) => {
		const context = await request.newContext({
			extraHTTPHeaders: { "auth-token": `Bearer ${process.env.CANDIDATE_ACC_AUTH_TOKEN}`, "api-token": process.env.API_TOKEN as string, "Content-Type": "application/json" },
		});
		await use(context);
		await context.dispose();
	},
});

export { expect } from "@playwright/test";
