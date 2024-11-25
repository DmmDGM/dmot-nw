// Defines authentication types
namespace Authentication {
	type Failure = {
		code: 400;
		message: string;
	};
	type Generic = Failure | Success;
	type Success = {
		authorization: string;
		code: 200;
	};
};
type Authentication = Authentication.Generic;

// Defines data types
namespace Data {
	type Client = {
		hex: string;
		name: string;
	};
	type Generic = Client | Message | User;
	type Message = {
		message: string;
		time: number;
		user: User;
	};
	type User = {
		hex: string;
		name: string;
	};
}
type Data = Data.Generic;

// Defines fetch types
namespace Fetch {
	type Authentication = {
		bot: boolean;
		hex: string;
		username: string;
	};
	type SendContent = {
		data: {
			message: string;
		};
		type: "message"
	};
	type UserList = {
		data: {
			callback: null;
		};
		type: "user-list"
	};
	type Generic = Authentication | SendContent | UserList;
}
type Fetch = Fetch.Generic;

// Defines packet types
namespace Packet {
	type Generic = Join | Leave | Message | MessageLog | Problem | Response | RICS;
	type Join = {
		data: {
			time: number;
			user: Data.User;
		}
		type: "join";
	};
	type Leave = {
		data: {
			time: number;
			user: Data.User;
		}
		type: "leave";
	};
	type Message = {
		data: Data.Message;
		type: "message";
	};
	type MessageLog = {
		data: Data.Message[];
		type: "message-log";
	};
	type Problem = {
		data: {
			message: string;
		};
		type: "problem";
	};
	type Response = {
		data: {
			"user-list": Data.User[];
		};
		type: "response";
	};
	type RICS = {
		data: {
			name: string;
		};
		type: "rics-info";
	};
}
type Packet = Packet.Generic;
