import { test as baseTest } from "@playwright/test";
import api from "../features/APIutils";

type MyFixtures = {
	API: api;
};

const fixtures = baseTest.extend<MyFixtures>({
	API: async ({ request }, use) => {
		const API = new api(request);
		await use(API);
	},
});

export { fixtures };
