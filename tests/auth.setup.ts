import { test as setup } from "@playwright/test";

const users = {
	default_Acc: {
		username: process.env.DEFAULT_ACC_USERNAME,
		password: process.env.DEFAULT_ACC_PASSWORD,
	},
	candidate_Acc: {
		username: process.env.CANDIDATE_ACC_USERNAME,
		password: process.env.CANDIDATE_ACC_PASSWORD,
	},
	employer_acc: {
		username: process.env.CANDIDATE_ACC_USERNAME,
		password: process.env.CANDIDATE_ACC_PASSWORD,
	},
};

setup("Get auth tokens for all accounts", async ({ request }) => {
	for (const user in users) {
		const response = await request.post("/api/v1/login", {
			data: {
				value: users[user].username,
				password: users[user].password,
			},
		});
		const responseBody = await response.json();
		const authToken = responseBody.data.authToken;

		process.env[`${user.toUpperCase()}_AUTH_TOKEN`] = authToken;
	}
});
