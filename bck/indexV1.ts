import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// Define activity interface
interface Activity {
	id: number;
	title: string;
	dueDate: string;
	completed: boolean;
}

// Define our MCP agent with tools
export class MyMCP extends McpAgent {
	server = new McpServer({
		name: "Authless Calculator",
		version: "1.0.0",
	});

	// Base URL for the API (you'll need to replace this with the actual API base URL)
	private readonly API_BASE_URL = "https://fakerestapi.azurewebsites.net"; // Replace with your actual API URL

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
									name: "get_activities",
									description: "Get all activities from the API"
								},
								{
									name: "create_activity",
									description: "Create a new activity",
									parameters: {
										title: "string - Activity title",
										dueDate: "string - Due date in ISO format (optional)",
										completed: "boolean - Whether the activity is completed (optional)"
									}
								},
								{
									name: "get_activity_by_id",
									description: "Get details of a specific activity by ID",
									parameters: {
										id: "number - ID of the activity to retrieve"
									}
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
			"get_activities",
			{},
			async () => {
				try {
					const response = await fetch(`${this.API_BASE_URL}/api/v1/Activities`, {
						method: 'GET',
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json'
						}
					});

					if (!response.ok) {
						throw new Error(`HTTP error! status: ${response.status}`);
					}

					const activities = await response.json() as Activity[];
					
					return {
						content: [
							{
								type: "text",
								text: `Found ${activities.length} activities:\n\n${JSON.stringify(activities, null, 2)}`
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

		// Create a new activity
		this.server.tool(
			"create_activity",
			{
				title: z.string(),
				dueDate: z.string().optional(),
				completed: z.boolean().optional().default(false)
			},
			async ({ title, dueDate, completed }) => {
				try {
					const activityData = {
						title,
						dueDate: dueDate || new Date().toISOString(),
						completed: completed || false
					};

					const response = await fetch(`${this.API_BASE_URL}/api/v1/Activities`, {
						method: 'POST',
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json'
						},
						body: JSON.stringify(activityData)
					});

					if (!response.ok) {
						throw new Error(`HTTP error! status: ${response.status}`);
					}

					const createdActivity = await response.json() as Activity;
					
					return {
						content: [
							{
								type: "text",
								text: `Successfully created activity:\n\n${JSON.stringify(createdActivity, null, 2)}`
							}
						]
					};
				} catch (error: unknown) {
					const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
					return {
						content: [
							{
								type: "text",
								text: `Error creating activity: ${errorMessage}`
							}
						]
					};
				}
			}
		);

		// Get activity by ID
		this.server.tool(
			"get_activity_by_id",
			{ id: z.number() },
			async ({ id }) => {
				try {
					const response = await fetch(`${this.API_BASE_URL}/api/v1/Activities/${id}`, {
						method: 'GET',
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json'
						}
					});

					if (!response.ok) {
						if (response.status === 404) {
							return {
								content: [
									{
										type: "text",
										text: `Activity with ID ${id} not found`
									}
								]
							};
						}
						throw new Error(`HTTP error! status: ${response.status}`);
					}

					const activity = await response.json() as Activity;
					
					return {
						content: [
							{
								type: "text",
								text: `Activity details:\n\n${JSON.stringify(activity, null, 2)}`
							}
						]
					};
				} catch (error: unknown) {
					const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
					return {
						content: [
							{
								type: "text",
								text: `Error fetching activity: ${errorMessage}`
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
