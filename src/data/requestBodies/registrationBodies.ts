import { Generate } from "../../utils/testDataGenerator";
import API from "../../features/APIutils";

export async function getRegistrationBody(api: API, account_type: string) {
	const generate = new Generate();
	let registrationBody: {
		[key: string]: {
			deviceId: string;
			email: string;
			firstName: string;
			password: string;
			phone: string;
			role: string;
		};
	} = {
		forCandidateAcc: {
			deviceId: "601294688103192",
			email: generate.FakeEmail("Can"),
			firstName: "Tempo",
			password: "123qweQWE",
			phone: "",
			role: "candidate",
		},
		forEmployerAcc: {
			deviceId: "601294688103192",
			email: generate.FakeEmail("Emp"),
			firstName: "Tempo",
			password: "123qweQWE",
			phone: "",
			role: "employer",
		},
	};
	registrationBody[account_type]["phone"] = await api.verifyRegistrationCode();
	return registrationBody;
}
