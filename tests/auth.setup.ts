import { test as setup } from "@playwright/test";

const users = {
	defaultAcc: {
		username: process.env.DEFAULT_ACC_USERNAME,
		password: process.env.DEFAULT_ACC_PASSWORD,
	},
	candidateAcc: {
		username: process.env.CANDIDATE_ACC_USERNAME,
		password: process.env.CANDIDATE_ACC_PASSWORD,
	},
};

export const authTokens = {
	defaultAcc: "",
	candidateAcc: "",
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

		authTokens[user] = authToken;
	}
});
