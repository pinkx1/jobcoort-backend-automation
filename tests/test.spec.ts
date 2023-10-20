import { POManager } from "./../pageObject/POManager";
import { test, expect } from "@playwright/test";

test("Default test", async ({ request }) => {
	const pm = new POManager();
	pm.authenticateAsDefaultUser();

	const response = await request.post("/api/v1/auth/comment", {
		data: {
			advert: "$2y$10$pdXbfDLhtj58IBd8ifDQ0OcLZXqickUKd.Snt5dTzp/zHXOkdblie",
			parent: null,
			comment: "Test comment",
			role: "candidate",
		},
	});
	const responseBody = await response.json();
});

test("Candidate test", async ({ request }) => {
	const pm = new POManager();
	pm.authenticateAsCandidateUser;

	const response = await request.post("/api/v1/auth/comment", {
		data: {
			advert: "$2y$10$pdXbfDLhtj58IBd8ifDQ0OcLZXqickUKd.Snt5dTzp/zHXOkdblie",
			parent: null,
			comment: "Test comment",
			role: "candidate",
		},
	});
	const responseBody = await response.json();
	expect(response.ok()).toBeTruthy();
});
