import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// Interface for Swagger/OpenAPI specification
interface SwaggerSpec {
	openapi?: string;
	swagger?: string;
	info: {
		title: string;
		version: string;
		description?: string;
	};
	paths: Record<string, Record<string, PathOperation>>;
	components?: {
		schemas?: Record<string, SchemaObject>;
		securitySchemes?: Record<string, SecurityScheme>;
	};
	servers?: Array<{
		url: string;
		description?: string;
	}>;
	security?: Array<Record<string, string[]>>;
}

interface PathOperation {
	tags?: string[];
	summary?: string;
	description?: string;
	operationId?: string;
	parameters?: Parameter[];
	requestBody?: RequestBody;
	responses: Record<string, Response>;
	security?: Array<Record<string, string[]>>;
}

interface Parameter {
	name: string;
	in: 'query' | 'header' | 'path' | 'cookie';
	description?: string;
	required?: boolean;
	schema: SchemaObject;
}

interface RequestBody {
	description?: string;
	content: Record<string, { schema: SchemaObject }>;
	required?: boolean;
}

interface Response {
	description: string;
	content?: Record<string, { schema: SchemaObject }>;
}

interface SchemaObject {
	type?: string;
	format?: string;
	properties?: Record<string, SchemaObject>;
	items?: SchemaObject;
	$ref?: string;
	required?: string[];
	nullable?: boolean;
	description?: string;
	enum?: any[];
	allOf?: SchemaObject[];
	oneOf?: SchemaObject[];
	anyOf?: SchemaObject[];
	additionalProperties?: boolean | SchemaObject;
}

interface SecurityScheme {
	type: string;
	scheme?: string;
	bearerFormat?: string;
	description?: string;
}

interface ApiConfig {
	name: string;
	displayName: string;
	defaultBaseUrl?: string;
	authType?: 'bearer' | 'apikey' | 'basic' | 'none';
	description?: string;
}

// Configuration for available APIs
const API_CONFIGS: Record<string, ApiConfig> = {
	'FakeRESTApi': {
		name: 'FakeRESTApi',
		displayName: 'Fake REST API',
		defaultBaseUrl: 'https://fakerestapi.azurewebsites.net',
		authType: 'none',
		description: 'A simple fake REST API for testing and development with Activities, Authors, Books, Cover Photos, and Users endpoints.'
	},
	'ChargeNET': {
		name: 'ChargeNET',
		displayName: 'ChargeNET Gen.2 API',
		defaultBaseUrl: 'https://api.chargenet.com',
		authType: 'bearer',
		description: 'ChargeNET Generation 2 web-application API for electric vehicle charging management and operations.'
	}
};

// Sample swagger specifications (simplified for demo)
const SAMPLE_SPECS: Record<string, SwaggerSpec> = {
	'FakeRESTApi': {
		openapi: '3.0.1',
		info: {
			title: 'Fake REST API',
			version: 'v1',
			description: 'A simple fake REST API for testing and development'
		},
		paths: {
			'/api/v1/Activities': {
				get: {
					tags: ['Activities'],
					summary: 'Get all activities',
					responses: { '200': { description: 'Success' } }
				},
				post: {
					tags: ['Activities'],
					summary: 'Create a new activity',
					requestBody: {
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										title: { type: 'string' },
										dueDate: { type: 'string' },
										completed: { type: 'boolean' }
									}
								}
							}
						}
					},
					responses: { '200': { description: 'Success' } }
				}
			},
			'/api/v1/Activities/{id}': {
				get: {
					tags: ['Activities'],
					summary: 'Get activity by ID',
					parameters: [{
						name: 'id',
						in: 'path',
						required: true,
						schema: { type: 'integer' }
					}],
					responses: { '200': { description: 'Success' } }
				}
			}
		}
	},
	'ChargeNET': {
		openapi: '3.0.1',
		info: {
			title: 'ChargeNET Gen.2 API',
			version: 'v2',
			description: 'ChargeNET Generation 2 web-application API'
		},
		paths: {
			'/account/login': {
				post: {
					tags: ['Authentication'],
					summary: 'User login',
					requestBody: {
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										username: { type: 'string' },
										password: { type: 'string' }
									}
								}
							}
						}
					},
					responses: { '200': { description: 'Success' } }
				}
			}
		}
	}
};

// Universal MCP Server that can work with any Swagger specification
export class UniversalMCP extends McpAgent {
	server = new McpServer({
		name: "Universal API MCP Server",
		version: "2.0.0",
	});

	private currentSpec: SwaggerSpec | null = null;
	private currentApiName: string | null = null;
	private availableSpecs: Record<string, SwaggerSpec> = {};

	async init() {
		// Load available swagger specifications
		this.availableSpecs = SAMPLE_SPECS;

		// Tool to list all available tools
		this.server.tool(
			"list_tools",
			{},
			async () => ({
				content: [
					{
						type: "text",
						text: JSON.stringify({
							current_api: this.currentSpec?.info?.title || "None loaded",
							current_api_name: this.currentApiName,
							available_apis: Object.keys(this.availableSpecs),
							system_tools: [
								{
									name: "list_tools",
									description: "List all available tools and API information"
								},
								{
									name: "switch_api",
									description: "Switch between different API specifications",
									parameters: {
										api_name: "string - Name of the API to switch to"
									}
								},
								{
									name: "get_api_info",
									description: "Get information about the currently loaded API"
								},
								{
									name: "make_api_call",
									description: "Make configured API calls with dynamic parameters",
									parameters: {
										method: "string - HTTP method (GET, POST, PUT, PATCH, DELETE)",
										path: "string - API endpoint path",
										base_url: "string - Base URL for the API",
										headers: "object - Request headers including authentication (optional)",
										query_params: "object - Query parameters (optional)",
										body: "object - Request body for POST/PUT/PATCH (optional)"
									}
								},
								{
									name: "authenticate_api",
									description: "Authenticate with API and get auth token",
									parameters: {
										base_url: "string - Base URL for the API",
										login_path: "string - Login endpoint path",
										username: "string - Username for authentication",
										password: "string - Password for authentication",
										method: "string - HTTP method for login (optional, default: POST)",
										additional_headers: "object - Additional headers for login request (optional)"
									}
								}
							],
							api_info: this.currentSpec ? await this.getApiInfo() : "No API loaded"
						}, null, 2)
					}
				]
			})
		);

		// Tool to switch between different API specifications
		this.server.tool(
			"switch_api",
			{
				api_name: z.string().describe("Name of the API specification to load")
			},
			async ({ api_name }) => {
				try {
					await this.loadSwaggerSpec(api_name);
					const config = this.getApiConfig(api_name);
					
					let statusMessage = `Successfully switched to ${this.currentSpec?.info?.title} API (${api_name}).`;
					
					if (config?.authType && config.authType !== 'none') {
						statusMessage += `\n\n🔐 This API requires authentication (${config.authType}).`;
					} else {
						statusMessage += `\n\n✅ This API does not require authentication.`;
					}
					
					if (config?.defaultBaseUrl) {
						statusMessage += `\n💡 Default base URL: ${config.defaultBaseUrl}`;
					}
					
					statusMessage += `\n\n${await this.getApiInfo()}`;
					
					return {
						content: [
							{
								type: "text",
								text: statusMessage
							}
						]
					};
				} catch (error: unknown) {
					const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
					return {
						content: [
							{
								type: "text",
								text: `Error switching to API: ${errorMessage}\nAvailable APIs: ${Object.keys(this.availableSpecs).join(', ')}`
							}
						]
					};
				}
			}
		);

		// Tool to get information about the current API
		this.server.tool(
			"get_api_info",
			{},
			async () => {
				if (!this.currentSpec) {
					return {
						content: [
							{
								type: "text",
								text: "No API specification loaded. Use switch_api to load one."
							}
						]
					};
				}

				return {
					content: [
						{
							type: "text",
							text: await this.getApiInfo()
						}
					]
				};
			}
		);

		// Tool for making API calls with dynamic configuration
		this.server.tool(
			"make_api_call",
			{
				method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']).describe("HTTP method"),
				path: z.string().describe("API endpoint path"),
				base_url: z.string().describe("Base URL for the API"),
				headers: z.record(z.string()).optional().describe("Request headers including authentication"),
				query_params: z.record(z.string()).optional().describe("Query parameters"),
				body: z.any().optional().describe("Request body for POST/PUT/PATCH")
			},
			async ({ method, path, base_url, headers = {}, query_params = {}, body }) => {
				try {
					// Build the full URL
					let url = base_url.endsWith('/') ? base_url.slice(0, -1) : base_url;
					url += path;
					
					// Add query parameters
					if (Object.keys(query_params).length > 0) {
						const params = new URLSearchParams(query_params);
						url += '?' + params.toString();
					}

					// Set default headers
					const requestHeaders: Record<string, string> = {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						...headers
					};

					// Prepare request body
					let requestBody: string | undefined;
					if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
						requestBody = typeof body === 'string' ? body : JSON.stringify(body);
					}

					// Make the API call
					const response = await fetch(url, {
						method,
						headers: requestHeaders,
						body: requestBody
					});

					let responseData;
					const contentType = response.headers.get('content-type');
					
					if (contentType?.includes('application/json')) {
						responseData = await response.json();
					} else {
						responseData = await response.text();
					}

					return {
						content: [
							{
								type: "text",
								text: `${response.ok ? '✅' : '❌'} ${method} ${path} - Status: ${response.status}\n\n${JSON.stringify(responseData, null, 2)}`
							}
						]
					};

				} catch (error: unknown) {
					const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
					return {
						content: [
							{
								type: "text",
								text: `❌ Error executing ${method} ${path}: ${errorMessage}`
							}
						]
					};
				}
			}
		);

		// Tool for authentication
		this.server.tool(
			"authenticate_api",
			{
				base_url: z.string().describe("Base URL for the API"),
				login_path: z.string().describe("Login endpoint path"),
				username: z.string().describe("Username for authentication"),
				password: z.string().describe("Password for authentication"),
				method: z.enum(['POST', 'PUT']).default('POST').describe("HTTP method for login"),
				additional_headers: z.record(z.string()).optional().describe("Additional headers for login request")
			},
			async ({ base_url, login_path, username, password, method = 'POST', additional_headers = {} }) => {
				try {
					const loginUrl = (base_url.endsWith('/') ? base_url.slice(0, -1) : base_url) + login_path;
					
					const response = await fetch(loginUrl, {
						method,
						headers: {
							'Content-Type': 'application/json',
							'Accept': 'application/json',
							...additional_headers
						},
						body: JSON.stringify({
							username,
							password
						})
					});
					
					if (!response.ok) {
						throw new Error(`Login failed: ${response.status} - ${response.statusText}`);
					}
					
					const loginData = await response.json() as any;
					
					// Extract token from response (common patterns)
					let token = loginData.token || loginData.access_token || loginData.accessToken || 
								loginData.authToken || loginData.auth_token || loginData.jwt;
					
					if (!token && loginData.data) {
						token = loginData.data.token || loginData.data.access_token || loginData.data.accessToken;
					}
					
					if (!token) {
						return {
							content: [
								{
									type: "text",
									text: `⚠️ Login successful but no token found in response. Full response:\n${JSON.stringify(loginData, null, 2)}`
								}
							]
						};
					}
					
					// Extract expiry if available
					const expiresIn = loginData.expires_in || loginData.expiresIn || 3600;
					const expiryDate = new Date(Date.now() + expiresIn * 1000);
					
					return {
						content: [
							{
								type: "text",
								text: `✅ Authentication successful!\n\nToken: ${token}\nExpires: ${expiryDate.toISOString()}\nExpires In: ${expiresIn} seconds\n\nFull response:\n${JSON.stringify(loginData, null, 2)}`
							}
						]
					};
					
				} catch (error: unknown) {
					const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
					return {
						content: [
							{
								type: "text",
								text: `❌ Authentication failed: ${errorMessage}`
							}
						]
					};
				}
			}
		);

		// Load default API
		const defaultSpec = Object.keys(this.availableSpecs)[0];
		if (defaultSpec) {
			await this.loadSwaggerSpec(defaultSpec);
		}
	}

	private getApiConfig(apiName: string): ApiConfig | null {
		return API_CONFIGS[apiName] || null;
	}

	private async loadSwaggerSpec(specName: string) {
		const spec = this.availableSpecs[specName];
		if (!spec) {
			throw new Error(`API specification '${specName}' not found. Available: ${Object.keys(this.availableSpecs).join(', ')}`);
		}

		this.currentSpec = spec;
		this.currentApiName = specName;
	}

	private async getApiInfo(): Promise<string> {
		if (!this.currentSpec) {
			return "No API specification currently loaded.";
		}

		const info = this.currentSpec.info;
		const config = this.getApiConfig(this.currentApiName || '');
		
		const pathCount = Object.keys(this.currentSpec.paths).length;
		
		let operationCount = 0;
		for (const pathItem of Object.values(this.currentSpec.paths)) {
			operationCount += Object.keys(pathItem).filter(method => 
				['get', 'post', 'put', 'patch', 'delete'].includes(method.toLowerCase())
			).length;
		}

		const tags = new Set<string>();
		for (const pathItem of Object.values(this.currentSpec.paths)) {
			for (const operation of Object.values(pathItem)) {
				if (operation.tags) {
					operation.tags.forEach(tag => tags.add(tag));
				}
			}
		}

		let authInfo = "Not required";
		if (config?.authType && config.authType !== 'none') {
			authInfo = `Required: ${config.authType}`;
		}

		return `📋 Current API: ${info.title} (v${info.version})
📝 Description: ${info.description || 'No description available'}
🔐 Authentication: ${authInfo}
${config?.defaultBaseUrl ? `💡 Default Base URL: ${config.defaultBaseUrl}` : ''}

📊 Statistics:
- ${pathCount} endpoints
- ${operationCount} operations  
- ${tags.size} service tags: ${Array.from(tags).join(', ')}

🔄 Available APIs: ${Object.keys(this.availableSpecs).join(', ')}

💡 Use make_api_call for configured API calls with your base URL and authentication.`;
	}
}

export default {
	fetch(request: Request, env: Env, ctx: ExecutionContext) {
		const url = new URL(request.url);

		if (url.pathname === "/sse" || url.pathname === "/sse/message") {
			return UniversalMCP.serveSSE("/sse").fetch(request, env, ctx);
		}

		if (url.pathname === "/mcp") {
			return UniversalMCP.serve("/mcp").fetch(request, env, ctx);
		}

		return new Response("Not found", { status: 404 });
	},
};