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
					const url = `${this.API_BASE_URL}/api/Account/Login`;
					const requestBody = {
						username: this.USERNAME,
						password: this.PASSWORD,
						loginMode: this.LOGIN_MODE
					};

					console.log('Making request to:', url);
					console.log('Request body:', JSON.stringify(requestBody, null, 2));

					const response = await fetch(url, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify(requestBody)
					});

					console.log('Response status:', response.status);
					console.log('Response headers:', Object.fromEntries(response.headers.entries()));

					const responseText = await response.text();
					console.log('Raw response:', responseText);

					if (!response.ok) {
						return {
							content: [
								{
									type: "text",
									text: `HTTP error! status: ${response.status}, response: ${responseText}`
								}
							]
						};
					}

					let data: AuthTokenResponse;
					try {
						data = JSON.parse(responseText) as AuthTokenResponse;
					} catch (parseError) {
						return {
							content: [
								{
									type: "text",
									text: `JSON parse error: ${parseError instanceof Error ? parseError.message : 'Unknown parse error'}. Raw response: ${responseText}`
								}
							]
						};
					}
					
					return {
						content: [
							{
								type: "text",
								text: `Authentication successful! Token: ${data.data.accessToken}`
							}
						]
					};
				} catch (error: unknown) {
					const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
					console.error('Fetch error:', error);
					return {
						content: [
							{
								type: "text",
								text: `Error making request: ${errorMessage}`
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
