import { fixtures as test, expect } from "../utils/fixtures";
import schemas from "../data/shemas/loginShemas";
import { isCorrectAvatarColor } from "../utils/helperFunctions";
import { getRegistrationBody } from "../data/requestBodies/registrationBodies";
import { Generate } from "../utils/testDataGenerator";

const generate = new Generate();

test("Login via valid email address", async ({ API }) => {
	const email = process.env.DEFAULT_ACC_EMAIL as string;
	const password = process.env.DEFAULT_ACC_PASSWORD as string;
	const username = process.env.DEFAULT_ACC_USERNAME as string;

	const request = API.createLoginRequest(email, password);
	const response = await API.postReq(request.endpoint, request.reqBody);
	const responseBody = await response.json();

	expect(response.status()).toBe(200);
	expect(response).toMatchSchema(schemas.validLoginShemaDefaultAcc);

	expect(responseBody.data.fullName).toBe("Default Account");

	const userdata = await API.UserdataRequest(username);
	const creationDate = userdata.data.createdAt;

	expect(await isCorrectAvatarColor(creationDate, responseBody.data.color)).toBeTruthy();
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
	const phone = process.env.DEFAULT_ACC_PHONE_NUMBER as string as string;
	const password = process.env.DEFAULT_ACC_PASSWORD as string;

	const request = API.createLoginRequest(phone, password);
	const response = await API.postReq(request.endpoint, request.reqBody);

	expect(response.status()).toBe(200);
	expect(response).toMatchSchema(schemas.validLoginShemaDefaultAcc);
});

test("Valid logout", async ({ API }) => {
	const body = await getRegistrationBody(API, "forCandidateAcc");
	const regResponse = await API.postReq("/api/v1/registration", body.forCandidateAcc);
	const regResponseBody = await regResponse.json();
	const authToken = `Bearer ${regResponseBody.data.authToken}`;
	const response = await API.getReq("/api/v1/auth/security/logout", authToken);
	const responseBody = await response.json();

	expect(response.status()).toBe(200);
	expect(responseBody).toStrictEqual([]);

	const loginRequest = API.createLoginRequest(
		body.forCandidateAcc.email,
		body.forCandidateAcc.password
	);
	const loginResponse = await API.postReq(loginRequest.endpoint, loginRequest.reqBody);
	const loginResponseBody = await loginResponse.json();
	const finalAuthToken = `Bearer ${loginResponseBody.data.authToken}`;
	const deleteAccRequest = await API.deleteAccount(finalAuthToken);
	expect(deleteAccRequest.status()).toBe(204);
});

test("Login to deleted account", async ({ API }) => {
	const request = API.createLoginRequest(
		process.env.DELETED_ACC_EMAIL as string,
		process.env.DELETED_ACC_PASSWORD as string
	);
	const response = await API.postReq(request.endpoint, request.reqBody);
	const responseBody = await response.json();

	expect(response.status()).toBe(400);
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

test.describe("Username validation positive checks", () => {
	test("Email with numbers in name", async ({ API }) => {
		const email = generate.FakeEmail("0");
		const { authToken, password } = await API.registerAccountWithCustomEmail(email);
		const request = API.createLoginRequest(email, password);
		const response = await API.postReq(request.endpoint, request.reqBody);

		expect(response.status()).toBe(200);

		const deleteAccRequest = await API.deleteAccount(authToken);
		expect(deleteAccRequest.status()).toBe(204);
	});

	test("Email with dash in name", async ({ API }) => {
		const email = generate.FakeEmail("-");
		const { authToken, password } = await API.registerAccountWithCustomEmail(email);
		const request = API.createLoginRequest(email, password);
		const response = await API.postReq(request.endpoint, request.reqBody);

		expect(response.status()).toBe(200);

		const deleteAccRequest = await API.deleteAccount(authToken);
		expect(deleteAccRequest.status()).toBe(204);
	});
	test("Email with underline in name", async ({ API }) => {
		const email = generate.FakeEmail("_");
		const { authToken, password } = await API.registerAccountWithCustomEmail(email);
		const request = API.createLoginRequest(email, password);
		const response = await API.postReq(request.endpoint, request.reqBody);

		expect(response.status()).toBe(200);

		const deleteAccRequest = await API.deleteAccount(authToken);
		expect(deleteAccRequest.status()).toBe(204);
	});
	test("Email with dot in name", async ({ API }) => {
		const email = generate.FakeEmail("a.");
		const { authToken, password } = await API.registerAccountWithCustomEmail(email);
		const request = API.createLoginRequest(email, password);
		const response = await API.postReq(request.endpoint, request.reqBody);

		expect(response.status()).toBe(200);

		const deleteAccRequest = await API.deleteAccount(authToken);
		expect(deleteAccRequest.status()).toBe(204);
	});
	test("Email with several dots in name", async ({ API }) => {
		const email = generate.FakeEmail("a.a.a");
		const { authToken, password } = await API.registerAccountWithCustomEmail(email);
		const request = API.createLoginRequest(email, password);
		const response = await API.postReq(request.endpoint, request.reqBody);

		expect(response.status()).toBe(200);

		const deleteAccRequest = await API.deleteAccount(authToken);
		expect(deleteAccRequest.status()).toBe(204);
	});
});

test.describe("Username validation negative checks", () => {
	test("Login without username", async ({ API }) => {
		const email = "";
		const request = API.createLoginRequest(email, "123qweQWE");
		const response = await API.postReq(request.endpoint, request.reqBody);
		const responseBody = await response.json();
		console.log(response);
		console.log(responseBody);

		expect(response.status()).toBe(400);
		expect(responseBody.message).toBe("wrongLoginCredentials");
	});
});
