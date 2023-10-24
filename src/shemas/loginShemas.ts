import { z } from "zod";

const schemas = {
	validLoginShemaDefaultAcc: z.object({
		data: z.object({
			fullName: z.string(),
			colorValue: z.string(),
			roles: z.array(z.string(), z.string()),
			id: z.number(),
			username: z.string(),
			firstName: z.string(),
			lastName: z.string(),
			initials: z.string(),
			online: z.boolean(),
			authToken: z.string(),
			employerRating: z.number(),
			candidateRating: z.number(),
			employerReviewsTotal: z.number(),
			candidateReviewsTotal: z.number(),
			picture: z.string(),
		}),
	}),
	invalidLoginSchema: z.object({}),
};

export default schemas;
