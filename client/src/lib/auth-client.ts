"use client"

/**
 * Simple hash function for demo purposes using Web Crypto API
 */
export async function hashPassword(password: string): Promise<string> {
    const msgUint8 = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    return hashHex;
}

export type User = {
    email: string;
    passwordHash: string;
    name?: string;
};

const USERS_KEY = "tathya_users";
const CURRENT_USER_KEY = "tathya_current_user";

export function getStoredUsers(): User[] {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(USERS_KEY);
    return stored ? JSON.parse(stored) : [];
}

export function saveUser(user: User) {
    if (typeof window === "undefined") return;
    const users = getStoredUsers();
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, user]));
}

export function setCurrentUser(user: User | null) {
    if (typeof window === "undefined") return;
    if (user) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
        localStorage.removeItem(CURRENT_USER_KEY);
    }
}

export function getCurrentUser(): User | null {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    return stored ? JSON.parse(stored) : null;
}
