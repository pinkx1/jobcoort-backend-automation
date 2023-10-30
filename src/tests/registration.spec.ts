import { fixtures as test, expect } from "../utils/fixtures";
import schemas from "../data/shemas/registrationShemas";
import { getRegistrationBody } from "../data/requestBodies/registrationBodies";
import { Generate } from "../utils/testDataGenerator";

test.describe("Fetch and resend registration code positive checks", () => {
	test("Fetch registration code", async ({ API }) => {
		const generate = new Generate();
		const phone = generate.FakePhoneNumber();
		const expectedAttemptsCnt = 1;
		const response = await API.postReq("/api/v1/fetch-registration-code", {
			phone,
		});
		const responseBody = await response.json();
		expect(response).toMatchSchema(schemas.validFetchCodeShemaDefaultAcc);
		API.validateFetchCodeResponse(response, responseBody, phone, expectedAttemptsCnt);
	});
	test("Fetch 2nd registration code", async ({ API }) => {
		const generate = new Generate();
		const phone = generate.FakePhoneNumber();
		const numOfRequests = 2;
		const expectedAttemptsCnt = 2;
		for (let i = 1; i < numOfRequests; i++) {
			await API.postReq("/api/v1/fetch-registration-code", { phone });
		}
		const response = await API.postReq("/api/v1/fetch-registration-code", {
			phone,
		});
		const responseBody = await response.json();

		API.validateFetchCodeResponse(response, responseBody, phone, expectedAttemptsCnt);
	});
	test("Fetch 3nd registration code", async ({ API }) => {
		const generate = new Generate();
		const phone = generate.FakePhoneNumber();
		const numOfRequests = 3;
		const expectedAttemptsCnt = 3;
		for (let i = 1; i < numOfRequests; i++) {
			await API.postReq("/api/v1/fetch-registration-code", { phone });
		}
		const response = await API.postReq("/api/v1/fetch-registration-code", {
			phone,
		});
		const responseBody = await response.json();

		API.validateFetchCodeResponse(response, responseBody, phone, expectedAttemptsCnt);
	});
	test("Fetch 4nd registration code", async ({ API }) => {
		const generate = new Generate();
		const phone = generate.FakePhoneNumber();
		const numOfRequests = 4;
		const expectedAttemptsCnt = 4;
		for (let i = 1; i < numOfRequests; i++) {
			await API.postReq("/api/v1/fetch-registration-code", { phone });
		}
		const response = await API.postReq("/api/v1/fetch-registration-code", {
			phone,
		});
		const responseBody = await response.json();

		API.validateFetchCodeResponse(response, responseBody, phone, expectedAttemptsCnt);
	});
	test("Fetch 5nd registration code", async ({ API }) => {
		const generate = new Generate();
		const phone = generate.FakePhoneNumber();
		const numOfRequests = 5;
		const expectedAttemptsCnt = 5;
		for (let i = 1; i < numOfRequests; i++) {
			await API.postReq("/api/v1/fetch-registration-code", { phone });
		}
		const response = await API.postReq("/api/v1/fetch-registration-code", {
			phone,
		});
		const responseBody = await response.json();

		API.validateFetchCodeResponse(response, responseBody, phone, expectedAttemptsCnt);
	});
});

test.describe("Fetch and resend registration code negative checks", () => {
	test("Fetch 6nd registration code", async ({ API }) => {
		const generate = new Generate();
		const phone = generate.FakePhoneNumber();
		const numOfRequests = 6;
		for (let i = 1; i < numOfRequests; i++) {
			await API.postReq("/api/v1/fetch-registration-code", { phone });
		}
		const response = await API.postReq("/api/v1/fetch-registration-code", {
			phone,
		});
		const responseBody = await response.json();
		expect(response.status()).toBe(400);
		expect(responseBody.message).toBe("isReachedSendingLimit");
	});
	test("Fetch registration code with phone number without '+'", async ({ API }) => {
		const generate = new Generate();
		const phone = generate.FakePhoneNumber(false, true);
		const response = await API.postReq("/api/v1/fetch-registration-code", {
			phone,
		});
		const responseBody = await response.json();
		expect(response.status()).toBe(400);
		expect(responseBody.message).toBe("invalidPhoneNumber");
	});

	test("Fetch registration code with a 10-digit phone number", async ({ API }) => {
		//NEED TO ADD AN ASSERTION
		const generate = new Generate();
		const phone = generate.FakePhoneNumber(true, false, false);
		const response = await API.postReq("/api/v1/fetch-registration-code", {
			phone,
		});
		const responseBody = await response.json();
		expect(response.status()).toBe(400);
		expect(responseBody.message).toBe("invalidPhoneNumber");
	});
	test("Fetch registration code with a 12-digit phone number", async ({ API }) => {
		//NEED TO ADD AN ASSERTION
		const generate = new Generate();
		const phone = generate.FakePhoneNumber(false, false, true);
		const response = await API.postReq("/api/v1/fetch-registration-code", {
			phone,
		});
		const responseBody = await response.json();
		expect(response.status()).toBe(400);
		expect(responseBody.message).toBe("invalidPhoneNumber");
	});
	test("Fetch registration code without phone number", async ({ API }) => {
		const phone = "";
		const response = await API.postReq("/api/v1/fetch-registration-code", {
			phone,
		});
		const responseBody = await response.json();
		expect(response.status()).toBe(400);
		expect(responseBody.message).toBe("Phone number is required");
	});
});

test.describe("Verify registration code positive checks", () => {
	test("Enter valid registration code", async ({ API }) => {
		const { phone, otpCode } = await API.fetchRegistrationCode();
		const response = await API.postReq("/api/v1/verify-registration-code", {
			code: otpCode,
			phone: phone,
		});
		const responseBody = await response.json();

		expect(response.status()).toBe(200);
		expect(responseBody.message).toBe("isPhoneNumberVerified");
		expect(typeof responseBody.message).toBe("string");
	});
});

test.describe("Verify registration code negative checks", () => {
	test("Enter invalid registration code", async ({ API }) => {
		let newOtpCode = "";
		const { phone, otpCode } = await API.fetchRegistrationCode();
		if (otpCode != "123321") {
			newOtpCode = "123321";
		} else {
			newOtpCode = "123123";
		}
		const response = await API.postReq("/api/v1/verify-registration-code", {
			code: newOtpCode,
			phone: phone,
		});
		const responseBody = await response.json();

		expect(response.status()).toBe(400);
		expect(responseBody.message).toBe("invalidVerificationCode");
	});
	test("Enter invalid registration code 2 times", async ({ API }) => {
		const { phone, otpCode } = await API.fetchRegistrationCode();
		const newOtpCode = otpCode !== "123321" ? "123321" : "123123";

		for (let i = 1; i < 2; i++) {
			await API.postReq("/api/v1/verify-registration-code", {
				code: newOtpCode,
				phone: phone,
			});
		}

		const response = await API.postReq("/api/v1/verify-registration-code", {
			code: newOtpCode,
			phone: phone,
		});

		const responseBody = await response.json();

		expect(response.status()).toBe(400);
		expect(responseBody.message).toBe("invalidVerificationCode");
	});
	test("Enter invalid registration code 3 times", async ({ API }) => {
		const { phone, otpCode } = await API.fetchRegistrationCode();
		const newOtpCode = otpCode !== "123321" ? "123321" : "123123";

		for (let i = 1; i < 3; i++) {
			await API.postReq("/api/v1/verify-registration-code", {
				code: newOtpCode,
				phone: phone,
			});
		}

		const response = await API.postReq("/api/v1/verify-registration-code", {
			code: newOtpCode,
			phone: phone,
		});

		const responseBody = await response.json();

		expect(response.status()).toBe(400);
		expect(responseBody.message).toBe("invalidVerificationCode");
	});
	test("Enter invalid registration code 4 times", async ({ API }) => {
		const { phone, otpCode } = await API.fetchRegistrationCode();
		const newOtpCode = otpCode !== "123321" ? "123321" : "123123";

		for (let i = 1; i < 4; i++) {
			await API.postReq("/api/v1/verify-registration-code", {
				code: newOtpCode,
				phone: phone,
			});
		}

		const response = await API.postReq("/api/v1/verify-registration-code", {
			code: newOtpCode,
			phone: phone,
		});

		const responseBody = await response.json();

		expect(response.status()).toBe(400);
		expect(responseBody.message).toBe("invalidVerificationCode");
	});
	test("Enter invalid registration code 5 times", async ({ API }) => {
		const { phone, otpCode } = await API.fetchRegistrationCode();
		const newOtpCode = otpCode !== "123321" ? "123321" : "123123";

		for (let i = 1; i < 5; i++) {
			await API.postReq("/api/v1/verify-registration-code", {
				code: newOtpCode,
				phone: phone,
			});
		}

		const response = await API.postReq("/api/v1/verify-registration-code", {
			code: newOtpCode,
			phone: phone,
		});

		const responseBody = await response.json();

		expect(response.status()).toBe(400);
		expect(responseBody.message).toBe("invalidVerificationCode");
	});
	test("Enter invalid registration code 6 times", async ({ API }) => {
		const { phone, otpCode } = await API.fetchRegistrationCode();
		const newOtpCode = otpCode !== "123321" ? "123321" : "123123";

		for (let i = 1; i < 6; i++) {
			await API.postReq("/api/v1/verify-registration-code", {
				code: newOtpCode,
				phone: phone,
			});
		}

		const response = await API.postReq("/api/v1/verify-registration-code", {
			code: newOtpCode,
			phone: phone,
		});

		const responseBody = await response.json();

		expect(response.status()).toBe(400);
		expect(responseBody.message).toBe("isReachedAttemptsLimit");
	});

	test("Verify without entering code", async ({ API }) => {
		const newOtpCode = "";
		const { phone, otpCode } = await API.fetchRegistrationCode();

		const response = await API.postReq("/api/v1/verify-registration-code", {
			code: newOtpCode,
			phone: phone,
		});
		const responseBody = await response.json();

		expect(response.status()).toBe(400);
		expect(responseBody.message).toBe("OTP code is required");
	});
});

test.describe("Registration positive checks", () => {
	test("Valid candidate Registration", async ({ API }) => {
		const body = await getRegistrationBody(API, "forCandidateAcc");
		const response = await API.postReq("/api/v1/registration", body.forCandidateAcc);

		expect(response.status()).toBe(200);
		expect(response).toMatchSchema(schemas.validRegistrationShemaDefaultAcc);
		const responseBody = await response.json();
		const authToken = responseBody.data.authToken;
		expect(responseBody.data.roles).toStrictEqual(["candidate"]);

		expect(responseBody.data.id).toBeGreaterThanOrEqual(1349);
		expect(responseBody.data.username).toContain(`tempo-`);
		expect(responseBody.data.firstName).toBe("Tempo");
		expect(responseBody.data.lastName).toBe(null);
		expect(responseBody.data.initials).toBe("T");
		expect(responseBody.data.online).toBe(false);
		expect(responseBody.data.employerRating).toBeGreaterThanOrEqual(0.0);
		expect(responseBody.data.candidateRating).toBeGreaterThanOrEqual(0.0);
		expect(responseBody.data.employerReviewsTotal).toBe(0);
		expect(responseBody.data.candidateReviewsTotal).toBe(0);
		expect(responseBody.data.picture).toBe(null);
		expect(responseBody.data.locale).toBe("en");

		const deleteAccRequest = await API.deleteAccount(authToken);
		expect(deleteAccRequest.status()).toBe(204);
	});
	test("Valid employer Registration", async ({ API }) => {
		const body = await getRegistrationBody(API, "forEmployerAcc");
		const response = await API.postReq("/api/v1/registration", body.forEmployerAcc);
		expect(response.status()).toBe(200);
		expect(response).toMatchSchema(schemas.validRegistrationShemaDefaultAcc);
		const responseBody = await response.json();
		const authToken = responseBody.data.authToken;

		expect(responseBody.data.roles).toStrictEqual(["employer"]);
		expect(responseBody.data.id).toBeGreaterThanOrEqual(1349);
		expect(responseBody.data.username).toContain(`tempo-`);
		expect(responseBody.data.firstName).toBe("Tempo");
		expect(responseBody.data.lastName).toBe(null);
		expect(responseBody.data.initials).toBe("T");
		expect(responseBody.data.online).toBe(false);
		expect(responseBody.data.employerRating).toBeGreaterThanOrEqual(0.0);
		expect(responseBody.data.candidateRating).toBeGreaterThanOrEqual(0.0);
		expect(responseBody.data.employerReviewsTotal).toBe(0);
		expect(responseBody.data.candidateReviewsTotal).toBe(0);
		expect(responseBody.data.locale).toBe("en");

		const deleteAccRequest = await API.deleteAccount(authToken);
		expect(deleteAccRequest.status()).toBe(204);
	});
});

test.describe("Registration negative checks", () => {
	test("Registration with an already registered phone number", async ({ API }) => {
		let body = await getRegistrationBody(API, "forCandidateAcc");
		body.forCandidateAcc.phone = process.env.DEFAULT_ACC_PHONE_NUMBER as string;
		const response = await API.postReq("/api/v1/registration", body.forCandidateAcc);

		expect(response.status()).toBe(400);
		const responseBody = await response.json();
		expect(responseBody["errors"][0]["name"]).toStrictEqual("phone");
		expect(responseBody["errors"][0]["message"]).toStrictEqual("isPhoneTaken");
	});
	test("Registration with an already registered email", async ({ API }) => {
		let body = await getRegistrationBody(API, "forCandidateAcc");
		body.forCandidateAcc.email = process.env.DEFAULT_ACC_EMAIL as string;
		const response = await API.postReq("/api/v1/registration", body.forCandidateAcc);

		expect(response.status()).toBe(400);
		const responseBody = await response.json();
		expect(responseBody["errors"][0]["name"]).toStrictEqual("email");
		expect(responseBody["errors"][0]["message"]).toStrictEqual("isEmailTaken");
	});

	test("Registration with banned phone", async ({ API }) => {
		const bannedPhone = await API.getBannedPhone();
		let body = await getRegistrationBody(API, "forCandidateAcc");
		body.forCandidateAcc.phone = bannedPhone;
		const response = await API.postReq("/api/v1/registration", body.forCandidateAcc);

		expect(response.status()).toBe(400);
		const responseBody = await response.json();
		expect(responseBody["errors"][0]["name"]).toStrictEqual("phone");
		expect(responseBody["errors"][0]["message"]).toStrictEqual("isPhoneNotVerified");
	});
});

test.describe("Verification for 'First Name' parameter in registration", () => {
	test('The "First Name" value contains 35 characters', async ({ API }) => {
		let body = await getRegistrationBody(API, "forCandidateAcc");
		const name = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
		body.forCandidateAcc.firstName = name;
		const response = await API.postReq("/api/v1/registration", body.forCandidateAcc);

		expect(response.status()).toBe(200);
		expect(response).toMatchSchema(schemas.validRegistrationShemaDefaultAcc);
		const responseBody = await response.json();
		const authToken = responseBody.data.authToken;

		expect(responseBody.data.firstName).toBe(name);

		const deleteAccRequest = await API.deleteAccount(authToken);
		expect(deleteAccRequest.status()).toBe(204);
	});
	test('The "First Name" value contains < 35 characters', async ({ API }) => {
		let body = await getRegistrationBody(API, "forCandidateAcc");
		const name = "aaaaaaaaaaaaaaaaaaaaaaaaaaaa";
		body.forCandidateAcc.firstName = name;
		const response = await API.postReq("/api/v1/registration", body.forCandidateAcc);

		expect(response.status()).toBe(200);
		expect(response).toMatchSchema(schemas.validRegistrationShemaDefaultAcc);
		const responseBody = await response.json();
		const authToken = responseBody.data.authToken;

		expect(responseBody.data.firstName).toBe(name);

		const deleteAccRequest = await API.deleteAccount(authToken);
		expect(deleteAccRequest.status()).toBe(204);
	});
	test('The "First Name" value contains an apostrophe', async ({ API }) => {
		let body = await getRegistrationBody(API, "forCandidateAcc");
		const name = "test'test";
		body.forCandidateAcc.firstName = name;
		const response = await API.postReq("/api/v1/registration", body.forCandidateAcc);

		expect(response.status()).toBe(200);
		expect(response).toMatchSchema(schemas.validRegistrationShemaDefaultAcc);
		const responseBody = await response.json();
		const authToken = responseBody.data.authToken;

		expect(responseBody.data.firstName).toBe(name);

		const deleteAccRequest = await API.deleteAccount(authToken);
		expect(deleteAccRequest.status()).toBe(204);
	});
	test('The "First Name" value contains a dash', async ({ API }) => {
		let body = await getRegistrationBody(API, "forCandidateAcc");
		const name = "test-test";
		body.forCandidateAcc.firstName = name;
		const response = await API.postReq("/api/v1/registration", body.forCandidateAcc);

		expect(response.status()).toBe(200);
		expect(response).toMatchSchema(schemas.validRegistrationShemaDefaultAcc);
		const responseBody = await response.json();
		const authToken = responseBody.data.authToken;

		expect(responseBody.data.firstName).toBe(name);

		const deleteAccRequest = await API.deleteAccount(authToken);
		expect(deleteAccRequest.status()).toBe(204);
	});
	test('The "First Name" value contains  only 2 characters', async ({ API }) => {
		let body = await getRegistrationBody(API, "forCandidateAcc");
		const name = "aa";
		body.forCandidateAcc.firstName = name;
		const response = await API.postReq("/api/v1/registration", body.forCandidateAcc);

		expect(response.status()).toBe(200);
		expect(response).toMatchSchema(schemas.validRegistrationShemaDefaultAcc);
		const responseBody = await response.json();
		const authToken = responseBody.data.authToken;

		expect(responseBody.data.firstName).toBe(name);

		const deleteAccRequest = await API.deleteAccount(authToken);
		expect(deleteAccRequest.status()).toBe(204);
	});
});
