// Imports
import { Client } from "./core/client";
import type { Message } from "./core/message";

const client = new Client({
	hex: "ef4f4f",
	name: "Dmot"
});
client.connectAddress("nightwatch.k4ffu.dev", 443);
client.on("message", (message: Message) => {
	if(message.content.toLowerCase() === "hai dmot") {
		message.reply("wats up!");
	}
});