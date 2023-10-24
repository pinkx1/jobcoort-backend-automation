import { fixtures as test, expect } from "../utils/fixtures";

test("Leave a comment from the default acc", async ({ API }) => {
	const response = await API.postReq(
		"/api/v1/auth/comment",
		{
			advert: "$2y$10$pdXbfDLhtj58IBd8ifDQ0OcLZXqickUKd.Snt5dTzp/zHXOkdblie",
			parent: null,
			comment: "Test comment",
			role: "candidate",
		},
		process.env.DEFAULT_ACC_AUTH_TOKEN
	);
	//const responseBody = await response.json();
	expect(response.ok()).toBeTruthy();
});

// test("Default test", async ({ defaultUser }) => {
// 	const response = await defaultUser.post("/api/v1/auth/comment", {
// 		data: {
// 			advert: "$2y$10$pdXbfDLhtj58IBd8ifDQ0OcLZXqickUKd.Snt5dTzp/zHXOkdblie",
// 			parent: null,
// 			comment: "Test comment",
// 			role: "candidate",
// 		},
// 	});
// 	const responseBody = await response.json();
// 	expect(response.ok()).toBeTruthy();
// });

// test("Candidate test", async ({ candidateUser }, workerInfo) => {
// 	const response = await candidateUser.post("/api/v1/auth/comment", {
// 		data: {
// 			advert: "$2y$10$pdXbfDLhtj58IBd8ifDQ0OcLZXqickUKd.Snt5dTzp/zHXOkdblie",
// 			parent: null,
// 			comment: "Test comment",
// 			role: "candidate",
// 		},
// 	});
// 	const responseBody = await response.json();
// 	// expect(response.ok()).toBeTruthy();
// });

// test("Employer test", async ({ employerUser }, workerInfo) => {
// 	const response = await employerUser.post("/api/v1/auth/comment", {
// 		data: {
// 			advert: "$2y$10$pdXbfDLhtj58IBd8ifDQ0OcLZXqickUKd.Snt5dTzp/zHXOkdblie",
// 			parent: null,
// 			comment: "Test comment",
// 			role: "employer",
// 		},
// 	});
// 	const responseBody = await response.json();
// 	// expect(response.ok()).toBeTruthy();
// });
