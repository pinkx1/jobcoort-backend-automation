import { AuthenticationPOM } from "./auth.setup";
import { test, request } from "@playwright/test";

export class POManager {
	private readonly authenticationPOM: AuthenticationPOM;

	constructor() {
		this.authenticationPOM = new AuthenticationPOM();
	}

	onAuthenticationPage() {
		return this.authenticationPOM;
	}

	async authenticateAsDefaultUser() {
		await this.authenticationPOM.authenticateAsDefaultUser(request);
	}

	async authenticateAsCandidateUser() {
		await this.authenticationPOM.authenticateAsCandidateUser(request);
	}
}
