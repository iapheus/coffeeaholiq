import AuthState from '@/types/AuthState';
import { create } from 'zustand';

export const useAuthStore = create<AuthState>((set) => ({
	isLoggedIn: false,
	login: () => {
		localStorage.setItem('Authorization', 'true');
		set({ isLoggedIn: true });
	},
	logout: () => {
		localStorage.removeItem('Authorization');
		set({ isLoggedIn: false });
	},
	checkAuth: () => {
		const token = localStorage.getItem('Authorization');
		set({ isLoggedIn: !!token });
	},
}));
