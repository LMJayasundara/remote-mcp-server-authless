import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// Define activity interface
interface AuthTokenResponse {
	isSuccess: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    createdOn: number;
    expiresOn: number;
  }
}

// Define our MCP agent with tools
export class MyMCP extends McpAgent {
	server = new McpServer({
		name: "Authless Calculator",
		version: "1.0.0",
	});

	// Base URL for the API (you'll need to replace this with the actual API base URL)
	private readonly API_BASE_URL = "http://52.13.222.102:11000"; // Replace with your actual API URL
  private readonly USERNAME = "chgAdmin";
  private readonly PASSWORD = "chgAdmin@123";
  private readonly LOGIN_MODE = "WEB";

	async init() {
		// Tool to list all available tools
		this.server.tool(
			"list_tools",
			{},
			async () => ({
				content: [
					{
						type: "text",
						text: JSON.stringify({
							available_tools: [
								{
									name: "get_auth_token",
									description: "Get an authentication token from the API"
								},
								{
									name: "list_tools",
									description: "List all available tools and their descriptions"
								}
							]
						}, null, 2)
					}
				],
			})
		);

		// Get all activities
		this.server.tool(
			"get_auth_token",
			{},
			async () => {
				try {
					const response = await fetch(`${this.API_BASE_URL}/api/Account/Login`, {
						method: 'POST',
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							username: this.USERNAME,
							password: this.PASSWORD,
							loginMode: this.LOGIN_MODE
						})
					});

					if (!response.ok) {
						throw new Error(`HTTP error! status: ${response.status}`);
					}

					const data = await response.json() as AuthTokenResponse;
					
					return {
						content: [
							{
								type: "text",
								text: `Authentication token: ${data.data.accessToken}`
							}
						]
					};
				} catch (error: unknown) {
					const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
					return {
						content: [
							{
								type: "text",
								text: `Error fetching activities: ${errorMessage}`
							}
						]
					};
				}
			}
		);
	}
}

export default {
	fetch(request: Request, env: Env, ctx: ExecutionContext) {
		const url = new URL(request.url);

		if (url.pathname === "/sse" || url.pathname === "/sse/message") {
			return MyMCP.serveSSE("/sse").fetch(request, env, ctx);
		}

		if (url.pathname === "/mcp") {
			return MyMCP.serve("/mcp").fetch(request, env, ctx);
		}

		return new Response("Not found", { status: 404 });
	},
};
