import { test as setup, expect, request } from "@playwright/test";

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

const authTokens = {
	defaultAcc: { authToken: "" },
	candidateAcc: { authToken: "" },
};

setup("authenticate as default user", async ({ request }) => {
	const response = await request.post("/api/v1/login", {
		data: {
			value: users.defaultAcc.username,
			password: users.defaultAcc.password,
		},
	});
	const responseBody = await response.json();
	const authToken = responseBody.data.authToken;
	authTokens.defaultAcc.authToken = authToken;

	setup.use({
		extraHTTPHeaders: {
			"auth-token": `Bearer ${authToken}` as string,
		},
	});
});

setup("authenticate as candidate unly user", async ({ request }) => {
	const response = await request.post("/api/v1/login", {
		data: {
			value: users.candidateAcc.username,
			password: users.candidateAcc.password,
		},
	});
	const responseBody = await response.json();
	const authToken = responseBody.data.authToken;
	authTokens.candidateAcc.authToken = authToken;

	setup.use({
		extraHTTPHeaders: {
			"auth-token": `Bearer ${authToken}` as string,
		},
	});
});
