import { z } from "zod";

const schemas = {
	validRegistrationShemaDefaultAcc: z.object({
		data: z.object({
			fullName: z.string(),
			colorValue: z.undefined(),
			roles: z.array(z.string()),
			id: z.number(),
			username: z.string(),
			firstName: z.string(),
			lastName: z.null(),
			initials: z.string(),
			online: z.boolean(),
			authToken: z.string(),
			employerRating: z.number(),
			candidateRating: z.number(),
			employerReviewsTotal: z.number(),
			candidateReviewsTotal: z.number(),
			picture: z.null(),
			locale: z.string(),
		}),
	}),
	validFetchCodeShemaDefaultAcc: z.object({
		attemptsCnt: z.number(),
		receiver: z.string(),
		message: z.string(),
		code: z.string(),
	}),
};

export default schemas;
