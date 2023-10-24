export async function isCorrectAvatarColor(
	creationDate: string,
	avatarColor: string
) {
	const date = new Date(creationDate);
	const dayOfWeek = date.getDay();

	let expectedColor: string;

	if (dayOfWeek === 0) {
		expectedColor = "#FAEDFA";
	} else if (dayOfWeek === 1) {
		expectedColor = "#EFF3FF";
	} else if (dayOfWeek === 2) {
		expectedColor = "#D9D9D9";
	} else if (dayOfWeek === 3) {
		expectedColor = "#FFF9C4";
	} else if (dayOfWeek === 4) {
		expectedColor = "#D5F6E4";
	} else if (dayOfWeek === 5) {
		expectedColor = "#FFE2E0";
	} else if (dayOfWeek === 6) {
		expectedColor = "#FEE7D6";
	} else {
		throw new Error("Invalid day");
	}

	return expectedColor === avatarColor;
}
