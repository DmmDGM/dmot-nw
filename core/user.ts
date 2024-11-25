// Imports
import type { Server } from "./server";

// Defines user class
export class User {
	#admin: boolean;
	#bot: boolean;
	#hex: string;
	#name: string;
	#server: Server;
	
	// Defines constructor
	constructor(data: Data.User, server: Server) {
		// Defines properties
		this.#admin = false;
		this.#bot = false;
		this.#hex = data.hex;
		this.#name = data.name;
		this.#server = server;
	}

	// Returns whether or not the user is an admin
	get admin(): boolean {
		return this.#admin;
	}

	// Returns whether or not the user is a bot
	get bot(): boolean {
		return this.#bot;
	}

	// Returns the user's assigned hex color
	get hex(): string {
		return this.#hex;
	}

	// Returns the user's assigned name
	get name(): string {
		return this.#name;
	}

	// Returns the user's server
	get server(): Server {
		return this.#server;
	}
}
