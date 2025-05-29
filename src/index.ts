import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// Define interfaces for ChargeNET API
interface LoginModel {
	username: string;
	password: string;
	loginMode: string;
}

interface AuthResponse {
	accessToken?: string;
	userId?: number;
	success?: boolean;
	message?: string;
}

interface ChargePoint {
	id: number;
	reference: string;
	name: string;
	description?: string;
	latitude?: number;
	longitude?: number;
	companyId?: number;
	locationId?: number;
	isActive?: boolean;
}

interface ChargeSession {
	id?: number;
	sessionId?: string;
	charger?: ChargePoint;
	startTime?: string;
	endTime?: string;
	totalAmount?: number;
	status?: string;
	userId?: number;
	energyConsumption?: number;
}

interface Company {
	id: number;
	companyName: string;
	description?: string;
	isActive?: boolean;
}

interface Location {
	id: number;
	locationName: string;
	address?: string;
	city?: string;
	country?: string;
	latitude?: number;
	longitude?: number;
}

// Define our MCP agent with ChargeNET tools
export class MyMCP extends McpAgent {
	server = new McpServer({
		name: "ChargeNET API Assistant",
		version: "2.0.0",
	});

	// ChargeNET API configuration
	private readonly API_BASE_URL = "http://52.13.222.102:11000";
	private readonly USERNAME = "chgAdmin";
	private readonly PASSWORD = "chgAdmin@123";
	private readonly LOGIN_MODE = "WEB";
	
	// Store authentication token
	private accessToken: string | null = null;
	private userId: number | null = null;

	async init() {
		// Authentication method
		this.server.tool(
			"authenticate",
			{
				description: "Authenticate with ChargeNET API to get access token",
				inputSchema: z.object({}),
			},
			async () => {
				try {
					const response = await fetch(`${this.API_BASE_URL}/api/Account/Login`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							username: this.USERNAME,
							password: this.PASSWORD,
							loginMode: this.LOGIN_MODE
						} as LoginModel),
					});

					if (!response.ok) {
						throw new Error(`Authentication failed: ${response.status} ${response.statusText}`);
					}

					const authData = await response.json() as AuthResponse;
					
					if (authData.accessToken) {
						this.accessToken = authData.accessToken;
						this.userId = authData.userId || null;
						
						return {
							content: [
								{
									type: "text",
									text: JSON.stringify({
										success: true,
										message: "Successfully authenticated with ChargeNET API",
										userId: this.userId,
										hasToken: !!this.accessToken
									}, null, 2)
								}
							]
						};
					} else {
						throw new Error("No access token received");
					}
				} catch (error) {
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify({
									success: false,
									error: error instanceof Error ? error.message : "Authentication failed",
									message: "Failed to authenticate with ChargeNET API"
								}, null, 2)
							}
						]
					};
				}
			}
		);

		// Helper method to make authenticated requests
		const makeAuthenticatedRequest = async (endpoint: string, options: RequestInit = {}) => {
			if (!this.accessToken) {
				throw new Error("Not authenticated. Please call authenticate tool first.");
			}

			const response = await fetch(`${this.API_BASE_URL}${endpoint}`, {
				...options,
				headers: {
					'Authorization': `Bearer ${this.accessToken}`,
					'Content-Type': 'application/json',
					...options.headers,
				},
			});

			if (!response.ok) {
				throw new Error(`API request failed: ${response.status} ${response.statusText}`);
			}

			return response.json();
		};

		// Tool to list all available tools
		this.server.tool(
			"list_tools",
			{
				description: "List all available ChargeNET API tools",
				inputSchema: z.object({}),
			},
			async () => ({
				content: [
					{
						type: "text",
						text: JSON.stringify({
							available_tools: [
								{
									name: "authenticate",
									description: "Authenticate with ChargeNET API to get access token"
								},
								// Account Management
								{
									name: "logout",
									description: "Logout from ChargeNET API"
								},
								// Charge Points
								{
									name: "get_charge_points",
									description: "Get all charge points"
								},
								{
									name: "get_charge_point_by_id",
									description: "Get details of a specific charge point by ID",
									parameters: {
										chargePointId: "number - ID of the charge point"
									}
								},
								{
									name: "get_charge_points_by_company",
									description: "Get charge points for a specific company",
									parameters: {
										companyId: "number - ID of the company"
									}
								},
								{
									name: "get_charge_points_for_user",
									description: "Get charge points accessible to authenticated user"
								},
								{
									name: "create_charge_point",
									description: "Create a new charge point",
									parameters: {
										reference: "string - Charge point reference",
										name: "string - Charge point name",
										description: "string - Description (optional)",
										latitude: "number - Latitude (optional)",
										longitude: "number - Longitude (optional)",
										companyId: "number - Company ID (optional)",
										locationId: "number - Location ID (optional)"
									}
								},
								// Charge Sessions
								{
									name: "get_charge_sessions_by_user",
									description: "Get charge sessions for a specific user",
									parameters: {
										userId: "number - ID of the user"
									}
								},
								{
									name: "get_ongoing_session",
									description: "Get ongoing charge session for a user",
									parameters: {
										userId: "number - ID of the user"
									}
								},
								{
									name: "start_charge_session",
									description: "Start a new charge session",
									parameters: {
										chargerReference: "string - Charger reference",
										evsePortId: "number - EVSE port ID",
										connectorPortId: "number - Connector port ID",
										userId: "number - User ID (optional)"
									}
								},
								{
									name: "stop_charge_session",
									description: "Stop a charge session",
									parameters: {
										sessionId: "string - Session ID",
										chargerReference: "string - Charger reference",
										evsePortId: "number - EVSE port ID",
										connectorPortId: "number - Connector port ID"
									}
								},
								// Companies
								{
									name: "get_companies",
									description: "Get all companies"
								},
								{
									name: "get_company_by_id",
									description: "Get details of a specific company by ID",
									parameters: {
										companyId: "number - ID of the company"
									}
								},
								{
									name: "create_company",
									description: "Create a new company",
									parameters: {
										companyName: "string - Company name",
										description: "string - Company description (optional)"
									}
								},
								// Locations
								{
									name: "get_locations",
									description: "Get all locations"
								},
								{
									name: "get_location_by_id",
									description: "Get details of a specific location by ID",
									parameters: {
										locationId: "number - ID of the location"
									}
								},
								{
									name: "get_locations_by_company",
									description: "Get locations for a specific company",
									parameters: {
										companyId: "number - ID of the company"
									}
								},
								{
									name: "create_location",
									description: "Create a new location",
									parameters: {
										locationName: "string - Location name",
										address: "string - Address (optional)",
										city: "string - City (optional)",
										country: "string - Country (optional)",
										latitude: "number - Latitude (optional)",
										longitude: "number - Longitude (optional)"
									}
								},
								// Dashboard
								{
									name: "get_dashboard_home",
									description: "Get dashboard home data for a user",
									parameters: {
										userId: "number - ID of the user"
									}
								},
								{
									name: "get_session_summary",
									description: "Get session summary for a user",
									parameters: {
										userId: "number - ID of the user"
									}
								}
							]
						}, null, 2)
					}
				]
			})
		);

		// Account Management Tools
		this.server.tool(
			"logout",
			{
				description: "Logout from ChargeNET API",
				inputSchema: z.object({}),
			},
			async () => {
				try {
					if (!this.accessToken) {
						return {
							content: [
								{
									type: "text",
									text: JSON.stringify({
										success: false,
										message: "No active session to logout"
									}, null, 2)
								}
							]
						};
					}

					const response = await fetch(`${this.API_BASE_URL}/api/Account/Logout/${this.accessToken}`, {
						method: 'POST',
						headers: {
							'Authorization': `Bearer ${this.accessToken}`,
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							username: this.USERNAME,
							password: this.PASSWORD,
							loginMode: this.LOGIN_MODE
						} as LoginModel),
					});

					this.accessToken = null;
					this.userId = null;

					return {
						content: [
							{
								type: "text",
								text: JSON.stringify({
									success: true,
									message: "Successfully logged out from ChargeNET API"
								}, null, 2)
							}
						]
					};
				} catch (error) {
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify({
									success: false,
									error: error instanceof Error ? error.message : "Logout failed"
								}, null, 2)
							}
						]
					};
				}
			}
		);

		// Charge Point Tools
		this.server.tool(
			"get_charge_points",
			{
				description: "Get all charge points",
				inputSchema: z.object({}),
			},
			async () => {
				try {
					const data = await makeAuthenticatedRequest('/api/ChargePoint/GetAll');
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify(data, null, 2)
							}
						]
					};
				} catch (error) {
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify({
									error: error instanceof Error ? error.message : "Failed to get charge points"
								}, null, 2)
							}
						]
					};
				}
			}
		);

		this.server.tool(
			"get_charge_point_by_id",
			{
				description: "Get details of a specific charge point by ID",
				inputSchema: z.object({
					chargePointId: z.number().describe("ID of the charge point"),
				}),
			},
			async (args) => {
				try {
					const { chargePointId } = args;
					const data = await makeAuthenticatedRequest(`/api/ChargePoint/GetChargePoint/ById/${chargePointId}`);
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify(data, null, 2)
							}
						]
					};
				} catch (error) {
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify({
									error: error instanceof Error ? error.message : "Failed to get charge point"
								}, null, 2)
							}
						]
					};
				}
			}
		);

		this.server.tool(
			"get_charge_points_by_company",
			{
				description: "Get charge points for a specific company",
				inputSchema: z.object({
					companyId: z.number().describe("ID of the company"),
				}),
			},
			async (args) => {
				try {
					const { companyId } = args;
					const data = await makeAuthenticatedRequest(`/api/ChargePoint/GetChargePoint/ByCompany/${companyId}`);
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify(data, null, 2)
							}
						]
					};
				} catch (error) {
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify({
									error: error instanceof Error ? error.message : "Failed to get charge points"
								}, null, 2)
							}
						]
					};
				}
			}
		);

		this.server.tool(
			"get_charge_points_for_user",
			{
				description: "Get charge points accessible to authenticated user",
				inputSchema: z.object({}),
			},
			async () => {
				try {
					const data = await makeAuthenticatedRequest('/api/ChargePoint/GetChargePoints/ForUser');
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify(data, null, 2)
							}
						]
					};
				} catch (error) {
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify({
									error: error instanceof Error ? error.message : "Failed to get charge points for user"
								}, null, 2)
							}
						]
					};
				}
			}
		);

		// Charge Session Tools
		this.server.tool(
			"get_charge_sessions_by_user",
			{
				description: "Get charge sessions for a specific user",
				inputSchema: z.object({
					userId: z.number().describe("ID of the user"),
				}),
			},
			async (args) => {
				try {
					const { userId } = args;
					const data = await makeAuthenticatedRequest(`/api/ChargeSession/GetSessions/ByUser/${userId}`);
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify(data, null, 2)
							}
						]
					};
				} catch (error) {
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify({
									error: error instanceof Error ? error.message : "Failed to get charge sessions"
								}, null, 2)
							}
						]
					};
				}
			}
		);

		this.server.tool(
			"get_ongoing_session",
			{
				description: "Get ongoing charge session for a user",
				inputSchema: z.object({
					userId: z.number().describe("ID of the user"),
				}),
			},
			async (args) => {
				try {
					const { userId } = args;
					const data = await makeAuthenticatedRequest(`/api/ChargeSession/GetOngoingSession/${userId}`);
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify(data, null, 2)
							}
						]
					};
				} catch (error) {
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify({
									error: error instanceof Error ? error.message : "Failed to get ongoing session"
								}, null, 2)
							}
						]
					};
				}
			}
		);

		this.server.tool(
			"start_charge_session",
			{
				description: "Start a new charge session",
				inputSchema: z.object({
					chargerReference: z.string().describe("Charger reference"),
					evsePortId: z.number().describe("EVSE port ID"),
					connectorPortId: z.number().describe("Connector port ID"),
					userId: z.number().optional().describe("User ID (optional)"),
				}),
			},
			async (args) => {
				try {
					const sessionData = {
						userId: args.userId || this.userId,
						chargerReference: args.chargerReference,
						evsePortId: args.evsePortId,
						connectorPortId: args.connectorPortId,
					};

					const data = await makeAuthenticatedRequest('/api/ChargeSession/Start', {
						method: 'POST',
						body: JSON.stringify(sessionData),
					});

					return {
						content: [
							{
								type: "text",
								text: JSON.stringify(data, null, 2)
							}
						]
					};
				} catch (error) {
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify({
									error: error instanceof Error ? error.message : "Failed to start charge session"
								}, null, 2)
							}
						]
					};
				}
			}
		);

		this.server.tool(
			"stop_charge_session",
			{
				description: "Stop a charge session",
				inputSchema: z.object({
					sessionId: z.string().describe("Session ID"),
					chargerReference: z.string().describe("Charger reference"),
					evsePortId: z.number().describe("EVSE port ID"),
					connectorPortId: z.number().describe("Connector port ID"),
				}),
			},
			async (args) => {
				try {
					const sessionData = {
						sessionId: args.sessionId,
						chargerReference: args.chargerReference,
						evsePortId: args.evsePortId,
						connectorPortId: args.connectorPortId,
					};

					const data = await makeAuthenticatedRequest('/api/ChargeSession/Stop', {
						method: 'POST',
						body: JSON.stringify(sessionData),
					});

					return {
						content: [
							{
								type: "text",
								text: JSON.stringify(data, null, 2)
							}
						]
					};
				} catch (error) {
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify({
									error: error instanceof Error ? error.message : "Failed to stop charge session"
								}, null, 2)
							}
						]
					};
				}
			}
		);

		// Company Tools
		this.server.tool(
			"get_companies",
			{
				description: "Get all companies",
				inputSchema: z.object({}),
			},
			async () => {
				try {
					const data = await makeAuthenticatedRequest('/api/Company/GetAll');
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify(data, null, 2)
							}
						]
					};
				} catch (error) {
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify({
									error: error instanceof Error ? error.message : "Failed to get companies"
								}, null, 2)
							}
						]
					};
				}
			}
		);

		this.server.tool(
			"get_company_by_id",
			{
				description: "Get details of a specific company by ID",
				inputSchema: z.object({
					companyId: z.number().describe("ID of the company"),
				}),
			},
			async (args) => {
				try {
					const { companyId } = args;
					const data = await makeAuthenticatedRequest(`/api/Company/GetCompany/ById/${companyId}`);
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify(data, null, 2)
							}
						]
					};
				} catch (error) {
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify({
									error: error instanceof Error ? error.message : "Failed to get company"
								}, null, 2)
							}
						]
					};
				}
			}
		);

		// Location Tools
		this.server.tool(
			"get_locations",
			{
				description: "Get all locations",
				inputSchema: z.object({}),
			},
			async () => {
				try {
					const data = await makeAuthenticatedRequest('/api/Location/GetAll');
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify(data, null, 2)
							}
						]
					};
				} catch (error) {
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify({
									error: error instanceof Error ? error.message : "Failed to get locations"
								}, null, 2)
							}
						]
					};
				}
			}
		);

		this.server.tool(
			"get_location_by_id",
			{
				description: "Get details of a specific location by ID",
				inputSchema: z.object({
					locationId: z.number().describe("ID of the location"),
				}),
			},
			async (args) => {
				try {
					const { locationId } = args;
					const data = await makeAuthenticatedRequest(`/api/Location/GetLocation/ById/${locationId}`);
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify(data, null, 2)
							}
						]
					};
				} catch (error) {
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify({
									error: error instanceof Error ? error.message : "Failed to get location"
								}, null, 2)
							}
						]
					};
				}
			}
		);

		this.server.tool(
			"get_locations_by_company",
			{
				description: "Get locations for a specific company",
				inputSchema: z.object({
					companyId: z.number().describe("ID of the company"),
				}),
			},
			async (args) => {
				try {
					const { companyId } = args;
					const data = await makeAuthenticatedRequest(`/api/Location/GetLocations/ByCompany/${companyId}`);
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify(data, null, 2)
							}
						]
					};
				} catch (error) {
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify({
									error: error instanceof Error ? error.message : "Failed to get locations"
								}, null, 2)
							}
						]
					};
				}
			}
		);

		// Dashboard Tools
		this.server.tool(
			"get_dashboard_home",
			{
				description: "Get dashboard home data for a user",
				inputSchema: z.object({
					userId: z.number().describe("ID of the user"),
				}),
			},
			async (args) => {
				try {
					const { userId } = args;
					const data = await makeAuthenticatedRequest(`/api/Dashboard/Home/${userId}`);
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify(data, null, 2)
							}
						]
					};
				} catch (error) {
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify({
									error: error instanceof Error ? error.message : "Failed to get dashboard data"
								}, null, 2)
							}
						]
					};
				}
			}
		);

		this.server.tool(
			"get_session_summary",
			{
				description: "Get session summary for a user",
				inputSchema: z.object({
					userId: z.number().describe("ID of the user"),
				}),
			},
			async (args) => {
				try {
					const { userId } = args;
					const data = await makeAuthenticatedRequest(`/api/Dashboard/SessionSummary/${userId}`);
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify(data, null, 2)
							}
						]
					};
				} catch (error) {
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify({
									error: error instanceof Error ? error.message : "Failed to get session summary"
								}, null, 2)
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
