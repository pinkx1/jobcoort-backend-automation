import { test as setup } from "@playwright/test";

interface User {
	username: string | undefined;
	password: string | undefined;
}

const users: { [key: string]: User } = {
	default_Acc: {
		username: process.env.DEFAULT_ACC_PHONE_NUMBER,
		password: process.env.DEFAULT_ACC_PASSWORD,
	},
	candidate_Acc: {
		username: process.env.CANDIDATE_ACC_PHONE_NUMBER,
		password: process.env.CANDIDATE_ACC_PASSWORD,
	},
	employer_acc: {
		username: process.env.CANDIDATE_ACC_PHONE_NUMBER,
		password: process.env.CANDIDATE_ACC_PASSWORD,
	},
};

setup("Get auth tokens for all accounts", async ({ request }) => {
	const requests = Object.keys(users).map(async (user) => {
		const response = await request.post("/api/v1/login", {
			data: {
				deviceId: "601294688103192",
				deviceInfo:
					'{"ua":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36","browser":{"name":"Chrome","version":"118.0.0.0","major":"118"},"engine":{"name":"Blink","version":"118.0.0.0"},"os":{"name":"Windows","version":"10"},"device":{},"cpu":{"architecture":"amd64"}}',
				timezone: "Asia/Yerevan",
				value: users[user].username,
				password: users[user].password,
			},
		});
		const responseBody = await response.json();
		const Token = responseBody.data.authToken;
		const authToken = `Bearer ${Token}`;

		process.env[`${user.toUpperCase()}_AUTH_TOKEN`] = authToken;
		return authToken;
	});

	const authTokens = await Promise.all(requests);
});
