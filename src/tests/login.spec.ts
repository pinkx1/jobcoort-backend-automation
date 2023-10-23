import { fixtures as test } from "../utils/fixtures";
import { expect } from "@playwright/test";

test("Login via email address", async ({ request, API }) => {
	const res = await API.postReq("/api/v1/login", {
		value: process.env.DEFAULT_ACC_USERNAME,
		password: process.env.DEFAULT_ACC_PASSWORD,
	});
	const resBody = await res.json();
	expect(res.status()).toBe(200);
	expect((await res.json()).data.fullName).toBe("Default Account");
	expect(await res.json()).toHaveProperty("data.authToken");
});
