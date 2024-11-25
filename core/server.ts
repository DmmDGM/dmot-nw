// Imports
import nodeEvents from "node:events";
import type { Client } from "./client";
import { Message } from "./message";
import { User } from "./user";

// Defines server class
export class Server extends nodeEvents.EventEmitter {
	#client: Client;
	#host: string;
	#port: number;
	#secure: boolean;
	#socket: WebSocket | null;
	#users: Map<string, User> | null;

	// Defines constructor
	constructor(host: string, port: number, client: Client) {
		// Initializes parent
		super();

		// Defines properties
		this.#client = client;
		this.#host = host;
		this.#port = port;
		this.#secure = port === 443;
		this.#socket = null;
		this.#users = null;
	}

	// Returns the server's client
	get client(): Client {
		return this.#client;
	}
	
	// Connects to socket
	async connect(): Promise<void> {
		// Checks for open connection
		if(this.#socket !== null) throw new Error("Client is already connected");

		// Posts the authentication request
		const response = await fetch(`${this.#secure ? "https": "http"}://${this.#host}:${this.#port}/api/join`, {
			body: JSON.stringify({
				bot: true,
				hex: this.#client.hex,
				username: this.#client.name
			} as Fetch.Authentication),
			headers: {
				"Content-Type": "application/json"
			},
			method: "POST"
        });
		const authentication: Authentication = await response.json();

		// Opens web socket
		switch(authentication.code) {
			case 200: {
				this.#socket = new WebSocket(`${this.#secure ? "wss" : "ws"}://${this.#host}:${this.#port}/api/ws?authorization=${authentication.authorization}`);
				this.#socket.addEventListener("open", () => {
					super.emit("connect");
				});
				this.#socket.addEventListener("close", () => {
					this.#socket = null;
					super.emit("disconnect");
				});
				this.#socket.addEventListener("message", (message) => {
					const packet: Packet = JSON.parse(message.data);
					super.emit("packet", packet);
					switch(packet.type) {
						case "join": {
							break;
						}
						case "leave": {
							break;
						}
						case "message": {
							super.emit("message", new Message(packet.data, this));
							break;
						}
						case "message-log": {
							break;
						}
						case "response": {
							break;
						}
						case "rics-info": {
							break;
						}
						default: {
							console.log(packet);
							break;
						}
					}
				});
				break;
			}
			default: {
				throw new Error(authentication.message);
			}
		}
	}
	
	// Returns whether or not the socket is connected
	get connected(): boolean {
		return this.#socket !== null;
	}

	// Disconnects from socket
	async disconnect(): Promise<void> {
		// Checks for open connection
		if(this.#socket === null) throw new Error("Socket is not connected");

		// Closes socket
		this.#socket.close();
	}

	// Returns the server's host
	get host(): string {
		return this.#host;
	}

	// Returns the server's port
	get port(): number {
		return this.#port;
	}

	// Returns whether or not the server is on a secure network
	get secure(): boolean {
		return this.#secure;
	}

	// Sends a generic message to the server
	async sendContent(content: string): Promise<void> {
		// Checks for open connection
		if(this.#socket === null) throw new Error("Socket is not connected");

		// Sends message
		this.#socket.send(JSON.stringify({
			data: {
				message: content
			},
			type: "message"
		} as Fetch.SendContent));
	}

	// Returns the server's socket
	get socket(): WebSocket | null {
		return this.#socket;
	}
}