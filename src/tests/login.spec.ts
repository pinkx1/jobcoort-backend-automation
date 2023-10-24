import { fixtures as test } from "../utils/fixtures";
import { expect } from "@playwright/test";
// import Ajv from "ajv";
// import { validateJsonSchema } from "../helpers/validateJsonSchema";
import { z } from "zod";

test("Login via valid email address", async ({ request, API }) => {
	const response = await API.postReq("/api/v1/login", {
		deviceId: "601294688103192",
		deviceInfo:
			'{"ua":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36","browser":{"name":"Chrome","version":"118.0.0.0","major":"118"},"engine":{"name":"Blink","version":"118.0.0.0"},"os":{"name":"Windows","version":"10"},"device":{},"cpu":{"architecture":"amd64"}}',
		timezone: "Asia/Yerevan",
		value: process.env.DEFAULT_ACC_USERNAME,
		password: process.env.DEFAULT_ACC_PASSWORD,
	});
	expect(response.status()).toBe(200);
	expect((await response.json()).data.fullName).toBe("Default Account");
	expect(await response.json()).toHaveProperty("data.authToken");

	const loginShema = z.object({
		data: z.object({
			fullName: z.string(),
			colorValue: z.string(),
			roles: z.array(z.string(), z.string()),
			id: z.number(),
			username: z.string(),
			firstName: z.string(),
			lastName: z.string(),
			initials: z.string(),
			online: z.boolean(),
			authToken: z.string(),
			employerRating: z.number(),
			candidateRating: z.number(),
			employerReviewsTotal: z.number(),
			candidateReviewsTotal: z.number(),
			picture: z.string(),
			locale: z.string(),
		}),
	});

	const mySchema = z.string();
	mySchema.safeParse("tuna"); // => { success: true; data: "tuna" }
	expect(response).toMatchSchema(loginShema);
});
