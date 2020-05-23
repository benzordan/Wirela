/**
 * Helper function to check if the specified value is inside
 * @param {string} value 
 * @param {string} target 
 */
export function multi_check(value, target) {
	return (value)? ((value.toLowerCase().search(target.toLowerCase()) >= 0) ? "checked": ""): "";
}