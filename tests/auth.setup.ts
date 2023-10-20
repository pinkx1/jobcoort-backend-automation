import { test as setup } from "@playwright/test";
import fs from "fs";

//const baseDir = ".auth/";
const users = {
	default_Acc: {
		value: "+13264562350",
		password: "123qweQWE1231",
	},
	candidate_Acc: {
		value: process.env.USERNAME_FOR_CANDIDATE_ACC,
		password: process.env.PASSWORD_FOR_CANDIDATE_ACC,
	},
};
const AUTH_TOKENS = {};

setup("Get auth tokens for all accounts", async ({ request }) => {
	for (const user in users) {
		// const authFile = `${baseDir}${user}.json`;
		// const current_user = {
		// 	origins: [
		// 		{
		// 			localStorage: [
		// 				{
		// 					value: "",
		// 				},
		// 			],
		// 		},
		// 	],
		// };
		const response = await request.post("/api/v1/login", {
			data: {
				value: users[user].value,
				password: users[user].password,
			},
		});
		const responseBody = await response.json();
		const authToken = responseBody.data.authToken;

		// current_user.origins[0].localStorage[0].value = authToken;
		// fs.writeFileSync(authFile, JSON.stringify(current_user));

		// # HASHMAP

		AUTH_TOKENS["DEFAULT"] = authToken;
		// process.env[`AUTH_TOKEN_FOR_${user.toUpperCase()}`] = authToken; //??????????????????
		//console.log(`Auth token for ${user}: ${authToken}`);
	}
});
