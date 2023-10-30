import { APIRequestContext } from "playwright-core";
import { Generate } from "../utils/testDataGenerator";
import { expect } from "@playwright/test";
import schemas from "../data/shemas/registrationShemas";
import { getRegistrationBody } from "../data/requestBodies/registrationBodies";

export type HttpMethod = "post" | "get" | "put" | "patch" | "delete";

interface ResponseBody {
	code: string;
	receiver: string;
	message: string;
	attemptsCnt: number;
}
export default class API {
	private request: APIRequestContext;

	constructor(request: APIRequestContext) {
		this.request = request;
	}
	/**
	 * Выполняет асинхронный HTTP-запрос к указанному эндпоинту с определенным методом.
	 * @param endpoint - Конечная точка, к которой выполняется запрос.
	 * @param method - Метод HTTP-запроса, например, "post", "get", "put", "patch" или "delete".
	 * @param reqBody - (опционально) Тело запроса в виде объекта.
	 * @param authToken - (опционально) Токен авторизации для запроса.
	 * @returns Объект ответа на запрос.
	 */
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
	/**
	 * Выполняет POST-запрос к указанному эндпоинту с телом запроса и, при необходимости, токеном авторизации.
	 * @param endpoint - Конечная точка, к которой выполняется POST-запрос.
	 * @param reqBody - Тело POST-запроса в виде объекта.
	 * @param authToken - (опционально) Токен авторизации для запроса.
	 * @returns Тело ответа на POST-запрос.
	 */
	async postReq(endpoint: string, reqBody: object, authToken?: string) {
		return this.makeRequest(endpoint, "post", reqBody, authToken);
	}
	/**
	 * Выполняет GET-запрос к указанному эндпоинту с опциональным токеном авторизации.
	 * @param endpoint - Конечная точка, к которой выполняется GET-запрос.
	 * @param authToken - (опционально) Токен авторизации для запроса.
	 * @returns Объект ответа на GET-запрос.
	 */
	async getReq(endpoint: string, authToken?: string) {
		return this.makeRequest(endpoint, "get", undefined, authToken);
	}
	/**
	 * Выполняет PUT-запрос к указанному URL с переданными данными и, при необходимости, токеном авторизации.
	 * @param endpoint - URL-адрес, к которому выполняется PUT-запрос.
	 * @param reqBody - Данные, которые будут отправлены в теле запроса.
	 * @param authToken - (опционально) Токен авторизации для выполнения защищенного запроса.
	 * @returns Объект ответа на PUT-запрос.
	 */
	async putReq(endpoint: string, reqBody: object, authToken?: string) {
		return this.makeRequest(endpoint, "put", reqBody, authToken);
	}
	/**
	 * Выполняет PATCH-запрос к указанному URL с переданными данными и, при необходимости, токеном авторизации.
	 * @param endpoint - URL-адрес, к которому выполняется PATCH-запрос.
	 * @param reqBody - Данные, которые будут отправлены в теле запроса.
	 * @param authToken - (опционально) Токен авторизации для выполнения защищенного запроса.
	 * @returns Объект ответа на PATCH-запрос.
	 */
	async patchReq(endpoint: string, reqBody: object, authToken?: string) {
		return this.makeRequest(endpoint, "patch", reqBody, authToken);
	}
	/**
	 * Выполняет DELETE-запрос к указанному URL с опциональным токеном авторизации.
	 * @param endpoint - URL-адрес, к которому выполняется DELETE-запрос.
	 * @param authToken - (опционально) Токен авторизации для выполнения защищенного запроса.
	 * @returns Объект ответа на DELETE-запрос.
	 */
	async deleteReq(endpoint: string, authToken?: string) {
		return this.makeRequest(endpoint, "delete", undefined, authToken);
	}
	/**
	 * Создает запрос на вход в систему с переданным именем пользователя и паролем.
	 * @param value - Номер телефона или email.
	 * @param password - Пароль для входа в систему.
	 * @returns Тело запроса на вход в систему.
	 */
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
	/**
	 * Выполняет запрос на получение данных о пользователе.
	 * @param user - Username пользователя, для которого необходимо получить данные профиля.
	 * @returns Объект ответа, содержащий данные профиля пользователя.
	 */
	async UserdataRequest(user: string) {
		const response = await this.getReq(`/api/v1/profile?username=${user}`);
		const responseBody = await response.json();
		return responseBody;
	}
	/**
	 * Выполняет запрос на получение кода регистрации для случайно сгенерированного телефонного номера.
	 * @returns Объект, содержащий сгенерированный телефонный номер и код регистрации.
	 */
	async fetchRegistrationCode() {
		const generate = new Generate();
		const phone = generate.FakePhoneNumber();
		const response = await this.postReq("/api/v1/fetch-registration-code", {
			phone,
		});
		const responseBody = await response.json();
		const otpCode = responseBody.code;

		return { phone, otpCode };
	}
	/**
	 * Выполняет запрос на проверку кода регистрации для ранее полученного телефонного номера.
	 * @returns Телефонный номер, для которого была выполнена проверка кода регистрации.
	 */
	async verifyRegistrationCode() {
		const { phone, otpCode } = await this.fetchRegistrationCode();
		const response = await this.postReq("/api/v1/verify-registration-code", {
			code: otpCode,
			phone: phone,
		});
		return phone;
	}
	/**
	 * Выполняет запрос на удаление учетной записи с использованием токена авторизации.
	 * @param authToken - Токен авторизации для выполнения запроса на удаление учетной записи.
	 * @returns Объект ответа на запрос на удаление учетной записи.
	 */
	async registerAccountWithCustomEmail(email: string) {
		const phone = await this.verifyRegistrationCode();
		console.log(phone);
		const password = "123qweQWE";
		const regResponse = await this.postReq("/api/v1/registration", {
			deviceId: "601294688103192",
			email: email,
			firstName: "Tempo",
			password: password,
			phone: phone,
			role: "candidate",
		});
		const regResponseBody = await regResponse.json();
		const authToken = `Bearer ${regResponseBody.data.authToken}`;

		if (regResponseBody.errors) {
			return regResponseBody.errors;
		}
		return { authToken, password };
	}
	/**
	 * Выполняет запрос на удаление учетной записи с использованием токена авторизации.
	 * @param authToken - Токен авторизации для выполнения запроса на удаление учетной записи.
	 * @returns Объект ответа на запрос на удаление учетной записи.
	 */
	async deleteAccount(authToken: string) {
		const response = await this.deleteReq("/api/v1/auth/profile", authToken);
		return response;
	}
	/**
	 * Проверяет ответ на запрос на соответствие ожидаемой структуре и значениям.
	 * @param response - Объект ответа на запрос.
	 * @param responseBody - Тело ответа на запрос.
	 * @param phone - Телефонный номер, связанный с ответом.
	 * @param expectedAttemptsCnt - Ожидаемое количество попыток в ответе.
	 * @returns Результаты проверки соответствия ответа ожидаемой структуре и значениям.
	 */
	validateFetchCodeResponse(
		response: Object,
		responseBody: ResponseBody,
		phone: string,
		expectedAttemptsCnt: number
	) {
		expect(response).toMatchSchema(schemas.validFetchCodeShemaDefaultAcc);
		expect(responseBody.code.length).toBe(6);
		expect(responseBody.receiver).toBe(phone);
		expect(responseBody.message).toBe("isVerificationCodeSent");
		expect(responseBody.attemptsCnt).toBe(expectedAttemptsCnt);
	}

	async getBannedPhone() {
		const generate = new Generate();
		const phone = generate.FakePhoneNumber();
		const numOfRequests = 6;
		for (let i = 1; i < numOfRequests; i++) {
			await this.postReq("/api/v1/fetch-registration-code", { phone });
		}
		const response = await this.postReq("/api/v1/fetch-registration-code", {
			phone,
		});
		expect(response.status()).toBe(400);

		return phone;
	}
}
