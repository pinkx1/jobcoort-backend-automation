import { fixtures as test, expect } from "../utils/fixtures";
import schemas from "../shemas/loginShemas";
import { isCorrectAvatarColor } from "../utils/helperFunctions";
import { getRegistrationBody } from "..


test("Login via valid email address", async ({ API }) => {
	const request = API.createLoginRequest(
		process.env.DEFAULT_ACC_EMAIL as string,
		process.env.DEFAULT_ACC_PASSWORD as string
	);
	const response = await API.postReq(request.endpoint, request.reqBody);

	expect(response.status()).toBe(200);
	const loginSchema = schemas.validLoginShemaDefaultAcc;
	expect(response).toMatchSchema(loginSchema);
	const responseBody = await response.json();

	expect(responseBody.data.fullName).toBe("Default Account");

	const userdata = await API.UserdataRequest(process.env.DEFAULT_ACC_USERNAME as string);
	const creationDate = userdata.data.createdAt;

	expect(await isCorrectAvatarColor(creationDate, responseBody.data.colorValue)).toBeTruthy();
	expect(responseBody.data.roles).toStrictEqual(["candidate", "employer"]);

	expect(responseBody.data.id).toBe(1349);
	expect(responseBody.data.username).toBe("defaultaccount");
	expect(responseBody.data.firstName).toBe("Default");
	expect(responseBody.data.lastName).toBe("Account");
	expect(responseBody.data.initials).toBe("DA");
	expect(responseBody.data.online).toBe(true);
	expect(responseBody.data.employerRating).toBeGreaterThanOrEqual(0.0);
	expect(responseBody.data.candidateRating).toBeGreaterThanOrEqual(0.0);
	expect(responseBody.data.employerReviewsTotal).toBeGreaterThanOrEqual(0);
	expect(responseBody.data.candidateReviewsTotal).toBeGreaterThanOrEqual(2);
	expect(responseBody.data.picture).toMatch(/^(https?|http):\/\/[^\s$.?#].[^\s]*\.webp$/);
	expect(responseBody.data.locale).toBe("en");
});

test("Login via valid phone number", async ({ API }) => {
	const request = API.createLoginRequest(
		process.env.DEFAULT_ACC_PHONE_NUMBER as string,
		process.env.DEFAULT_ACC_PASSWORD as string
	);
	const response = await API.postReq(request.endpoint, request.reqBody);

	expect(response.status()).toBe(200);
	const loginSchema = schemas.validLoginShemaDefaultAcc;
});

test("Valid logout", async ({ API }) => {
	const body = await getRegistrationBody(API, "forEmployerAcc");
	const response = await API.postReq("/api/v1/registration", body.forEmployerAcc);
	const response = await API.getReq(
		"/api/v1/auth/security/logout",
		process.env.DEFAULT_ACC_AUTH_TOKEN
	);
	expect(response.status()).toBe(200);
	const responseBody = await response.json();
	expect(responseBody).toStrictEqual([]);
});

test("Login to deleted account", async ({ API }) => {
	const request = API.createLoginRequest(
		process.env.DELETED_ACC_EMAIL as string,
		process.env.DELETED_ACC_PASSWORD as string
	);
	const response = await API.postReq(request.endpoint, request.reqBody);

	expect(response.status()).toBe(400);
	const responseBody = await response.json();
	expect(responseBody.code).toBe(400);
	expect(responseBody.message).toBe("wrongLoginCredentials");
});

test("Login to account with old password", async ({ API }) => {
	const request = API.createLoginRequest(
		process.env.CHANGED_PASSWORD_ACC_OLD_PASSWORD as string,
		process.env.DELETED_ACC_PASSWORD as string
	);
	const response = await API.postReq(request.endpoint, request.reqBody);

	expect(response.status()).toBe(400);
	const responseBody = await response.json();
	expect(responseBody.code).toBe(400);
	expect(responseBody.message).toBe("wrongLoginCredentials");
});

test("Login to account with incorrect password", async ({ API }) => {
	const request = API.createLoginRequest(
		process.env.DEFAULT_ACC_EMAIL as string,
		"IncorrectPassword123"
	);
	const response = await API.postReq(request.endpoint, request.reqBody);

	expect(response.status()).toBe(400);
	const responseBody = await response.json();
	expect(responseBody.code).toBe(400);
	expect(responseBody.message).toBe("wrongLoginCredentials");
});

// test.describe("Username validation", () => {
// 	test("Email with numbers in name", async ({ API }) => {
// 		const request = API.createLoginRequest(
// 			"test123@myezjob.com",
// 			"123qweQWE"
// 		);
// 		const response = await API.postReq(request.endpoint, request.reqBody);

// 		expect(response.status()).toBe(400);
// 		const responseBody = await response.json();
// 		expect(responseBody.code).toBe(400);
// 		expect(responseBody.message).toBe("wrongLoginCredentials");
// 	});

// 	test("Email with numbers in domain", async ({ API }) => {
// 		const request = API.createLoginRequest(
// 			"test@myezjob123.com",
// 			"123qweQWE"
// 		);
// 		const response = await API.postReq(request.endpoint, request.reqBody);

// 		expect(response.status()).toBe(400);
// 		const responseBody = await response.json();
// 		expect(responseBody.code).toBe(400);
// 		expect(responseBody.message).toBe("wrongLoginCredentials");
// 	});
// });
