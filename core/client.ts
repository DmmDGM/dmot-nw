// Imports
import nodeEvents from "node:events";
import type { Message } from "./message";
import { Server } from "./server";
import { User } from "./user";

// Defines client class
export class Client extends nodeEvents.EventEmitter {
	#hex: string;
	#name: string;
	#servers: Map<string, Server> = new Map();

	// Defines constructor
	constructor(data: Data.Client) {
		// Initializes parent
		super();

		// Defines properties
		this.#hex = data.hex;
		this.#name = data.name;
	}

	// Connects to an address
	async connectAddress(host: string, port: number): Promise<void> {
		// Checks for existing connection
		const address = `${host}:${port}`;
		if(this.#servers.has(address)) throw new Error("Connection already exists");

		// Opens connection
		const server = new Server(host, port, this);
		await server.connect();
		server.on("connect", () => {
			this.#servers.set(address, server);
			super.emit("connect", server);
		});
		server.on("disconnect", () => {
			this.#servers.delete(address);
			super.emit("disconnect", server);
		});
		server.on("message", (message: Message) => {
			super.emit("message", message);
		});
	}

	// Connects to a server
	async connectServer(connection: Server): Promise<void> {
		await this.connectAddress(connection.host, connection.port);
	}

	// Disconnects from an address
	async disconnectAddress(host: string, port: number): Promise<void> {
		// Checks for stray connection
		const address = `${host}:${port}`;
		if(!this.#servers.has(address)) throw new Error("Connection does not exist");

		// Closes connection
		await this.#servers.get(address)!.disconnect();
	}

	// Disconnects from a server
	async disconnectServer(connection: Server): Promise<void> {
		await this.disconnectAddress(connection.host, connection.port);
	}

	// Returns the client's assigned hex color
	get hex(): string {
		return this.#hex;
	}

	// Returns the client's assigned name
	get name(): string {
		return this.#name;
	}
}