import { test as baseTest, expect, Page, APIRequestContext, request } from "@playwright/test";
import { authTokens } from "./auth.setup";

export const test = baseTest.extend<{
	defaultUser: APIRequestContext;
	candidateUser: APIRequestContext;
}>({
	defaultUser: async ({}, use) => {
		const context = await request.newContext({
			extraHTTPHeaders: { Authorization: `Bearer ${authTokens.defaultAcc}` },
		});
		await use(context);
		await context.dispose();
	},

	candidateUser: async ({}, use) => {
		const context = await request.newContext({
			extraHTTPHeaders: { Authorization: `Bearer ${authTokens.candidateAcc}` },
		});
		await use(context);
		await context.dispose();
	},
});

export { expect } from "@playwright/test";
