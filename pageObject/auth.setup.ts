import { test, request, APIRequestContext } from "@playwright/test";

export class AuthenticationPOM {
	request: APIRequestContext;
	users: any;
	authTokens: any;
	// request: APIRequest;

	constructor(request: APIRequestContext) {
		this.request = request;
		this.users = {
			defaultAcc: {
				username: process.env.DEFAULT_ACC_USERNAME,
				password: process.env.DEFAULT_ACC_PASSWORD,
			},
			candidateAcc: {
				username: process.env.CANDIDATE_ACC_USERNAME,
				password: process.env.CANDIDATE_ACC_PASSWORD,
			},
		};
		this.authTokens = {
			defaultAcc: { authToken: "" },
			candidateAcc: { authToken: "" },
		};
	}

	private setupExtraHeaders(authToken: string) {
		test.use({
			extraHTTPHeaders: {
				"auth-token": `Bearer ${authToken}`,
			},
		});
	}

	async authenticateAsDefaultUser(request: APIRequestContext) {
		const response = await request.post("/api/v1/login", {
			data: {
				value: this.users.defaultAcc.username,
				password: this.users.defaultAcc.password,
			},
		});
		const responseBody = await response.json();
		const authToken = await responseBody.data.authToken;
		this.authTokens.defaultAcc.authToken = authToken;
		this.setupExtraHeaders(authToken);
	}

	async authenticateAsCandidateUser(request: APIRequestContext) {
		const response = await request.post("/api/v1/login", {
			data: {
				value: this.users.candidateAcc.username,
				password: this.users.candidateAcc.password,
			},
		});
		const responseBody = await response.json();
		const authToken = responseBody.data.authToken;
		this.authTokens.candidateAcc.authToken = authToken;

		this.setupExtraHeaders(authToken);
	}
}

export default AuthenticationPOM;
