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

		// Authentication method
		this.server.tool(
			"authenticate",
			{},
			async () => {
				try {
					const loginPayload = {
						username: this.USERNAME,
						password: this.PASSWORD,
						loginMode: this.LOGIN_MODE
					} as LoginModel;

					console.log(`Attempting to authenticate with URL: ${this.API_BASE_URL}/api/Account/Login`);
					console.log(`Login payload:`, JSON.stringify(loginPayload, null, 2));

					const response = await fetch(`${this.API_BASE_URL}/api/Account/Login`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'Accept': 'application/json',
						},
						body: JSON.stringify(loginPayload),
					});

					console.log(`Authentication response status: ${response.status} ${response.statusText}`);
					console.log(`Response headers:`, Object.fromEntries(response.headers.entries()));

					// Try to get response text regardless of status
					const responseText = await response.text();
					console.log(`Response body:`, responseText);

					if (!response.ok) {
						return {
							content: [
								{
									type: "text",
									text: JSON.stringify({
										success: false,
										error: `Authentication failed: ${response.status} ${response.statusText}`,
										details: responseText,
										url: `${this.API_BASE_URL}/api/Account/Login`,
										payload: loginPayload
									}, null, 2)
								}
							]
						};
					}

					// Try to parse as JSON
					let authData: AuthResponse;
					try {
						authData = JSON.parse(responseText) as AuthResponse;
					} catch (parseError) {
						return {
							content: [
								{
									type: "text",
									text: JSON.stringify({
										success: false,
										error: "Failed to parse authentication response as JSON",
										responseText: responseText,
										parseError: parseError instanceof Error ? parseError.message : "Unknown parse error"
									}, null, 2)
								}
							]
						};
					}
					
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
										hasToken: !!this.accessToken,
										tokenLength: this.accessToken.length
									}, null, 2)
								}
							]
						};
					} else {
						return {
							content: [
								{
									type: "text",
									text: JSON.stringify({
										success: false,
										error: "No access token received in response",
										authResponse: authData
									}, null, 2)
								}
							]
						};
					}
				} catch (error) {
					console.error('Authentication error:', error);
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify({
									success: false,
									error: error instanceof Error ? error.message : "Authentication failed",
									message: "Failed to authenticate with ChargeNET API",
									errorType: error instanceof Error ? error.constructor.name : typeof error
								}, null, 2)
							}
						]
					};
				}
			}
		);

		// Test connectivity tool
		this.server.tool(
			"test_connectivity",
			{},
			async () => {
				try {
					console.log(`Testing connectivity to: ${this.API_BASE_URL}`);
					
					// Test base URL
					const baseResponse = await fetch(this.API_BASE_URL, {
						method: 'GET',
						headers: {
							'Accept': 'application/json',
						},
					});

					console.log(`Base URL response: ${baseResponse.status} ${baseResponse.statusText}`);
					const baseText = await baseResponse.text();
					console.log(`Base response:`, baseText);

					// Test if there's an API documentation endpoint
					const possibleEndpoints = [
						'/swagger',
						'/api',
						'/api/swagger',
						'/swagger/index.html',
						'/docs',
						'/api/docs',
						'/health',
						'/ping'
					];

					const results = [];
					for (const endpoint of possibleEndpoints) {
						try {
							const testResponse = await fetch(`${this.API_BASE_URL}${endpoint}`, {
								method: 'GET',
								headers: { 'Accept': 'application/json' },
							});
							results.push({
								endpoint,
								status: testResponse.status,
								statusText: testResponse.statusText,
								available: testResponse.ok
							});
						} catch (err) {
							results.push({
								endpoint,
								error: err instanceof Error ? err.message : 'Unknown error',
								available: false
							});
						}
					}

					return {
						content: [
							{
								type: "text",
								text: JSON.stringify({
									baseUrl: this.API_BASE_URL,
									baseResponse: {
										status: baseResponse.status,
										statusText: baseResponse.statusText,
										body: baseText.substring(0, 500) + (baseText.length > 500 ? '...' : '')
									},
									endpointTests: results,
									credentials: {
										username: this.USERNAME,
										loginMode: this.LOGIN_MODE,
										passwordLength: this.PASSWORD.length
									}
								}, null, 2)
							}
						]
					};
				} catch (error) {
					console.error('Connectivity test error:', error);
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify({
									success: false,
									error: error instanceof Error ? error.message : "Connectivity test failed",
									errorType: error instanceof Error ? error.constructor.name : typeof error
								}, null, 2)
							}
						]
					};
				}
			}
		);

		// Logout tool
		this.server.tool(
			"logout",
			{},
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

		// Get all charge points
		this.server.tool(
			"get_charge_points",
			{},
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

		// Get charge point by ID
		this.server.tool(
			"get_charge_point_by_id",
			{ chargePointId: z.number() },
			async ({ chargePointId }) => {
				try {
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

		// Get charge points by company
		this.server.tool(
			"get_charge_points_by_company",
			{ companyId: z.number() },
			async ({ companyId }) => {
				try {
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

		// Get charge points for user
		this.server.tool(
			"get_charge_points_for_user",
			{},
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

		// Get charge sessions by user
		this.server.tool(
			"get_charge_sessions_by_user",
			{ userId: z.number() },
			async ({ userId }) => {
				try {
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

		// Get ongoing session
		this.server.tool(
			"get_ongoing_session",
			{ userId: z.number() },
			async ({ userId }) => {
				try {
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

		// Start charge session
		this.server.tool(
			"start_charge_session",
			{
				chargerReference: z.string(),
				evsePortId: z.number(),
				connectorPortId: z.number(),
				userId: z.number().optional(),
			},
			async ({ chargerReference, evsePortId, connectorPortId, userId }) => {
				try {
					const sessionData = {
						userId: userId || this.userId,
						chargerReference,
						evsePortId,
						connectorPortId,
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

		// Stop charge session
		this.server.tool(
			"stop_charge_session",
			{
				sessionId: z.string(),
				chargerReference: z.string(),
				evsePortId: z.number(),
				connectorPortId: z.number(),
			},
			async ({ sessionId, chargerReference, evsePortId, connectorPortId }) => {
				try {
					const sessionData = {
						sessionId,
						chargerReference,
						evsePortId,
						connectorPortId,
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

		// Get all companies
		this.server.tool(
			"get_companies",
			{},
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

		// Get company by ID
		this.server.tool(
			"get_company_by_id",
			{ companyId: z.number() },
			async ({ companyId }) => {
				try {
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

		// Get all locations
		this.server.tool(
			"get_locations",
			{},
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

		// Get location by ID
		this.server.tool(
			"get_location_by_id",
			{ locationId: z.number() },
			async ({ locationId }) => {
				try {
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

		// Get locations by company
		this.server.tool(
			"get_locations_by_company",
			{ companyId: z.number() },
			async ({ companyId }) => {
				try {
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

		// Get dashboard home data
		this.server.tool(
			"get_dashboard_home",
			{ userId: z.number() },
			async ({ userId }) => {
				try {
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

		// Get session summary
		this.server.tool(
			"get_session_summary",
			{ userId: z.number() },
			async ({ userId }) => {
				try {
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
