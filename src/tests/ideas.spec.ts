export function isValidDate(date: string) {
	if (Date.parse(date)) {
		return true;
	} else {
		return false;
	}
}
