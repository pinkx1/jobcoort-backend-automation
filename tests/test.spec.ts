import { test } from "./fixtures";

test("Default test", async ({ defaultUser }, workerInfo) => {
	const response = await defaultUser.post("/api/v1/auth/comment", {
		data: {
			advert: "$2y$10$pdXbfDLhtj58IBd8ifDQ0OcLZXqickUKd.Snt5dTzp/zHXOkdblie",
			parent: null,
			comment: "Test comment",
			role: "candidate",
		},
	});
	const responseBody = await response.json();
	//expect(response.ok()).toBeTruthy();
});

test("Candidate test", async ({ candidateUser }, workerInfo) => {
	const response = await candidateUser.post("/api/v1/auth/comment", {
		data: {
			advert: "$2y$10$pdXbfDLhtj58IBd8ifDQ0OcLZXqickUKd.Snt5dTzp/zHXOkdblie",
			parent: null,
			comment: "Test comment",
			role: "candidate",
		},
	});
	const responseBody = await response.json();
	// expect(response.ok()).toBeTruthy();
});
