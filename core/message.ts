// Imports
import type { Server } from "./server";
import { User } from "./user";

// Defines message class
export class Message {
	#content: string;
	#server: Server;
	#time: number;
	#user: User;
	
	constructor(data: Data.Message, server: Server) {
		this.#content = data.message;
		this.#server = server;
		this.#time = data.time;
		this.#user = new User(data.user, server);
	}

	// Returns the message's content
	get content(): string {
		return this.#content;
	}

	// Replies to the message
	async reply(content: string): Promise<void> {
		await this.#server.sendContent(`@${this.user.name}, ${content}`);
	}

	// Returns the message's server
	get server(): Server {
		return this.#server;
	}

	// Returns the message's time
	get time(): number {
		return this.#time;
	}

	// Returns the message's user
	get user(): User {
		return this.#user;
	}
}
