
export function setUserToStorage(userData) {
	localStorage.setItem('user', JSON.stringify(userData));
}