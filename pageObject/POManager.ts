import { AuthenticationPOM } from "./auth.setup";
import { test, request, APIRequestContext } from "@playwright/test";

export class POManager {
	private readonly authenticationPOM: AuthenticationPOM;
	private readonly request: APIRequestContext;

	constructor(request: APIRequestContext) {
		this.request = request;
		this.authenticationPOM = new AuthenticationPOM(this.request);
	}

	onAuthenticationPage() {
		return this.authenticationPOM;
	}

	async authenticateAsDefaultUser() {
		await this.authenticationPOM.authenticateAsDefaultUser(this.request);
	}

	async authenticateAsCandidateUser() {
		await this.authenticationPOM.authenticateAsCandidateUser(this.request);
	}
}
