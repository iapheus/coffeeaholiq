export default interface AuthState {
	isLoggedIn: boolean;
	login: () => void;
	logout: () => void;
	checkAuth: () => void;
}
