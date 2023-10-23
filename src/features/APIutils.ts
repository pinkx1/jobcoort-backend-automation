import { APIRequestContext } from "playwright-core";

export default class API {
	private request: APIRequestContext;

	constructor(request: APIRequestContext) {
		this.request = request;
	}
	private async makeRequest(endpoint: string, method: string, reqBody?: object, authToken?: string) {
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
}
