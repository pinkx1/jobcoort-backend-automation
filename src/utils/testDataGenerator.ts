import { faker } from "@faker-js/faker";

/**
 * Класс для генерации фейковых данных: имена, телефонные номера, emails
 */
export class Generate {
	private firstThreeDigits: string[];
	private allowedChars: string;

	constructor() {
		this.firstThreeDigits = ["100", "200", "300", "400", "500", "600", "700", "800", "900"];
		this.allowedChars = "abcdefghijklmnopqrstuvwxyz";
	}
	/**
	 * Генерирует случайное полное имя.
	 * @returns Случайное полное имя.
	 */
	FakeFullName(): string {
		const randomName = faker.person.fullName();
		return randomName;
	}
	/**
	 * Генерирует случайное имя.
	 * @returns Случайное имя.
	 */
	FakeFirstName(): string {
		const randomName = faker.person.fullName();
		return randomName;
	}
	/**
	 * Генерирует фейковый телефонный номер с дополнительными опциями.
	 * @param reduceByOneDigit - Определяет, должен ли номер иметь на одну цифру меньше с конца.
	 * @param withoutPlusSign - Определяет, должен ли номер быть сгенерирован без знака "+" в начале.
	 * @param additionalDigit - Определяет, должна ли быть добавлена дополнительная цифра в конец номера.
	 * @returns Сгенерированный фейковый телефонный номер в соответствии с заданными параметрами.
	 */
	FakePhoneNumber(
		reduceByOneDigit = false,
		withoutPlusSign = false,
		additionalDigit = false
	): string {
		let remainingDigits = Math.floor(Math.random() * 10000000)
			.toString()
			.padStart(7, "0");

		if (reduceByOneDigit) {
			remainingDigits = remainingDigits.slice(0, -1);
		}

		if (additionalDigit) {
			remainingDigits += Math.floor(Math.random() * 10);
		}

		const randomFirstThreeDigits =
			this.firstThreeDigits[Math.floor(Math.random() * this.firstThreeDigits.length)];
		const plusSign = withoutPlusSign ? "" : "+";
		return `${plusSign}1${randomFirstThreeDigits}${remainingDigits}`;
	}

	/**
	 * Генерирует случайный электронный адрес с заданным префиксом.
	 * @param prefix - Префикс электронного адреса.
	 * @returns Сгенерированный электронный адрес.
	 */
	FakeEmail(prefix: string): string {
		let randomString = "";
		const length = 15;

		for (let i = 0; i < length; i++) {
			randomString += this.allowedChars.charAt(
				Math.floor(Math.random() * this.allowedChars.length)
			);
		}

		return `${prefix}${randomString}@test.test`;
	}
}
