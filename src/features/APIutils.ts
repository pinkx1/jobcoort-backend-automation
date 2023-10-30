import { APIRequestContext } from "playwright-core";

export type HttpMethod = "post" | "get" | "put" | "patch" | "delete";

export default class API {
	private request: APIRequestContext;

	constructor(request: APIRequestContext) {
		this.request = request;
	}

	private async makeRequest(
		endpoint: string,
		method: HttpMethod,
		reqBody?: object,
		authToken?: string
	) {
		const res = await this.request[method](endpoint, {
			headers: authToken ? { "auth-token": authToken } : {},
			data: reqBody,
		});
		return res;
	}

	async postReq(endpoint: string, reqBody: object, authToken?: string) {
		return this.makeRequest(endpoint, "post", reqBody, authToken);
	}
	async getReq(endpoint: string, authToken?: string) {
		return this.makeRequest(endpoint, "get", undefined, authToken);
	}
	async putReq(endpoint: string, reqBody: object, authToken?: string) {
		return this.makeRequest(endpoint, "put", reqBody, authToken);
	}
	async patchReq(endpoint: string, reqBody: object, authToken?: string) {
		return this.makeRequest(endpoint, "patch", reqBody, authToken);
	}
	async deleteReq(endpoint: string, authToken?: string) {
		return this.makeRequest(endpoint, "delete", undefined, authToken);
	}
	createLoginRequest(value: string, password: string) {
		return {
			endpoint: "/api/v1/login",
			method: "post",
			reqBody: {
				deviceId: "601294688103192",
				deviceInfo:
					'{"ua":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36","browser":{"name":"Chrome","version":"118.0.0.0","major":"118"},"engine":{"name":"Blink","version":"118.0.0.0"},"os":{"name":"Windows","version":"10"},"device":{},"cpu":{"architecture":"amd64"}}',
				timezone: "Asia/Yerevan",
				value: value,
				password: password,
			},
		};
	}
	async UserdataRequest(user: string) {
		const response = await this.getReq(
			`/api/v1/profile?username=${user}&role=employer`
		);
		const responseBody = await response.json();
		return responseBody;
	}
}
