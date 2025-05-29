import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { API_CONFIGS, getApiConfig, formatAuthHeader, AUTH_TEMPLATES } from './api-config.js';

// Import swagger specifications directly
import FakeRESTApiSpec from './swaggers/FakeRESTApi.json';
import ChargeNETSpec from './swaggers/ChargeNET.json';

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

interface GeneratedTool {
	name: string;
	description: string;
	method: string;
	path: string;
	tags: string[];
}

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
		this.loadAvailableSpecs();

		// System tools that are always available
		this.registerSystemTools();

		// If a default spec is available, load it
		const defaultSpec = Object.keys(this.availableSpecs)[0];
		if (defaultSpec) {
			await this.loadSwaggerSpec(defaultSpec);
		}
	}

	private loadAvailableSpecs() {
		// Load bundled specifications
		this.availableSpecs = {
			'FakeRESTApi': FakeRESTApiSpec as SwaggerSpec,
			'ChargeNET': ChargeNETSpec as SwaggerSpec
		};
	}

	private registerSystemTools() {
		// Tool to list all available tools
		this.server.tool(
			"list_tools",
			{},
			async () => {
				const tools = await this.generateToolsList();
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify({
								current_api: this.currentSpec?.info?.title || "None loaded",
								current_api_name: this.currentApiName,
								available_apis: Object.keys(this.availableSpecs),
								available_tools: tools
							}, null, 2)
						}
					],
				};
			}
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
					const config = getApiConfig(api_name);
					
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
				} catch (error) {
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
					
				} catch (error) {
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
	}

	private async loadSwaggerSpec(specName: string) {
		const spec = this.availableSpecs[specName];
		if (!spec) {
			throw new Error(`API specification '${specName}' not found. Available: ${Object.keys(this.availableSpecs).join(', ')}`);
		}

		try {
			this.currentSpec = spec;
			this.currentApiName = specName;
			
			// Generate and register tools for this API
			await this.generateAndRegisterTools();
			
		} catch (error) {
			throw new Error(`Failed to load API specification: ${error}`);
		}
	}

	private async generateAndRegisterTools() {
		if (!this.currentSpec) return;

		const paths = this.currentSpec.paths;
		
		for (const [pathTemplate, pathItem] of Object.entries(paths)) {
			for (const [method, operation] of Object.entries(pathItem)) {
				if (['get', 'post', 'put', 'patch', 'delete'].includes(method.toLowerCase())) {
					await this.generateToolForOperation(pathTemplate, method, operation);
				}
			}
		}
	}

	private async generateToolForOperation(pathTemplate: string, method: string, operation: PathOperation) {
		const toolName = this.generateToolName(pathTemplate, method, operation);
		const toolDescription = this.generateToolDescription(pathTemplate, method, operation);
		const toolSchema = this.generateToolSchema(operation);

		this.server.tool(
			toolName,
			toolSchema,
			async (args: any) => {
				return await this.executeApiCall(pathTemplate, method, operation, args);
			}
		);
	}

	private generateToolName(pathTemplate: string, method: string, operation: PathOperation): string {
		// Generate a clean tool name
		if (operation.operationId) {
			return operation.operationId.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
		}

		// Create name from path and method
		const pathParts = pathTemplate
			.split('/')
			.filter(part => part && !part.startsWith('{'))
			.join('_');

		const tag = operation.tags?.[0] || 'api';
		
		return `${method.toLowerCase()}_${tag}_${pathParts}`.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
	}

	private generateToolDescription(pathTemplate: string, method: string, operation: PathOperation): string {
		let description = operation.summary || operation.description || `${method.toUpperCase()} ${pathTemplate}`;
		
		if (operation.tags?.length) {
			description += ` (Tags: ${operation.tags.join(', ')})`;
		}

		return description;
	}

	private generateToolSchema(operation: PathOperation): Record<string, any> {
		const schema: Record<string, any> = {};

		// Add path parameters
		const pathParams = operation.parameters?.filter(p => p.in === 'path') || [];
		const queryParams = operation.parameters?.filter(p => p.in === 'query') || [];
		const headerParams = operation.parameters?.filter(p => p.in === 'header') || [];

		for (const param of pathParams) {
			schema[param.name] = this.convertSwaggerTypeToZod(param.schema, param.required);
		}

		for (const param of queryParams) {
			schema[param.name] = this.convertSwaggerTypeToZod(param.schema, param.required);
		}

		for (const param of headerParams) {
			schema[param.name] = this.convertSwaggerTypeToZod(param.schema, param.required);
		}

		// Add request body parameters
		if (operation.requestBody) {
			const content = operation.requestBody.content;
			const jsonContent = content['application/json'] || content['text/json'] || Object.values(content)[0];
			
			if (jsonContent?.schema) {
				const bodySchema = this.convertSwaggerSchemaToFlat(jsonContent.schema);
				Object.assign(schema, bodySchema);
			}
		}

		return schema;
	}

	private convertSwaggerSchemaToFlat(schema: SchemaObject): Record<string, any> {
		const result: Record<string, any> = {};

		if (schema.$ref) {
			// Handle $ref - resolve from components
			const resolvedSchema = this.resolveSchemaRef(schema.$ref);
			if (resolvedSchema) {
				return this.convertSwaggerSchemaToFlat(resolvedSchema);
			}
			return result;
		}

		if (schema.type === 'object' && schema.properties) {
			for (const [propName, propSchema] of Object.entries(schema.properties)) {
				const isRequired = schema.required?.includes(propName) || false;
				result[propName] = this.convertSwaggerTypeToZod(propSchema, isRequired);
			}
		}

		return result;
	}

	private resolveSchemaRef(ref: string): SchemaObject | null {
		if (!this.currentSpec?.components?.schemas) {
			return null;
		}

		// Handle #/components/schemas/SchemaName format
		const refParts = ref.split('/');
		if (refParts.length === 4 && refParts[0] === '#' && refParts[1] === 'components' && refParts[2] === 'schemas') {
			const schemaName = refParts[3];
			return this.currentSpec.components.schemas[schemaName] || null;
		}

		return null;
	}

	private convertSwaggerTypeToZod(schema: SchemaObject, required = false): any {
		// Handle $ref first
		if (schema.$ref) {
			const resolvedSchema = this.resolveSchemaRef(schema.$ref);
			if (resolvedSchema) {
				return this.convertSwaggerTypeToZod(resolvedSchema, required);
			}
			// Fallback to any if we can't resolve the ref
			return required ? z.any() : z.any().optional();
		}

		let zodType;

		switch (schema.type) {
			case 'string':
				zodType = z.string();
				// Handle string formats
				if (schema.format === 'date-time') {
					zodType = zodType.datetime();
				} else if (schema.format === 'email') {
					zodType = zodType.email();
				} else if (schema.format === 'uri') {
					zodType = zodType.url();
				}
				// Handle enums
				if (schema.enum && schema.enum.length > 0) {
					zodType = z.enum(schema.enum as [string, ...string[]]);
				}
				break;
			case 'integer':
				zodType = z.number().int();
				if (schema.format === 'int32') {
					zodType = zodType.min(-2147483648).max(2147483647);
				}
				break;
			case 'number':
				zodType = z.number();
				break;
			case 'boolean':
				zodType = z.boolean();
				break;
			case 'array':
				if (schema.items) {
					const itemType = this.convertSwaggerTypeToZod(schema.items, true);
					zodType = z.array(itemType);
				} else {
					zodType = z.array(z.any());
				}
				break;
			case 'object':
				if (schema.properties) {
					const objectSchema: Record<string, any> = {};
					for (const [propName, propSchema] of Object.entries(schema.properties)) {
						const isRequired = schema.required?.includes(propName) || false;
						objectSchema[propName] = this.convertSwaggerTypeToZod(propSchema, isRequired);
					}
					zodType = z.object(objectSchema);
				} else {
					zodType = z.record(z.any());
				}
				break;
			default:
				zodType = z.any();
		}

		if (!required || schema.nullable) {
			zodType = zodType.optional();
		}

		if (schema.description) {
			zodType = zodType.describe(schema.description);
		}

		return zodType;
	}

	private async executeApiCall(pathTemplate: string, method: string, operation: PathOperation, args: any): Promise<any> {
		return {
			content: [
				{
					type: "text",
					text: `⚠️ This generated tool requires configuration. Please use the 'make_api_call' tool instead with your base URL and authentication headers.\n\nExample usage:\n- Method: ${method.toUpperCase()}\n- Path: ${pathTemplate}\n- Required parameters: ${JSON.stringify(args, null, 2)}`
				}
			]
		};
	}

	private async generateToolsList(): Promise<GeneratedTool[]> {
		const tools: GeneratedTool[] = [
			{
				name: "list_tools",
				description: "List all available tools and API information",
				method: "SYSTEM",
				path: "/system",
				tags: ["system"]
			},
			{
				name: "switch_api",
				description: "Switch between different API specifications",
				method: "SYSTEM",
				path: "/system",
				tags: ["system"]
			},
			{
				name: "get_api_info",
				description: "Get information about the currently loaded API",
				method: "SYSTEM",
				path: "/system",
				tags: ["system"]
			},
			{
				name: "configure_api",
				description: "Configure base URL and authentication for the API",
				method: "SYSTEM",
				path: "/system",
				tags: ["system"]
			}
		];

		if (this.currentSpec) {
			// Add dynamically generated tools
			for (const [pathTemplate, pathItem] of Object.entries(this.currentSpec.paths)) {
				for (const [method, operation] of Object.entries(pathItem)) {
					if (['get', 'post', 'put', 'patch', 'delete'].includes(method.toLowerCase())) {
						const toolName = this.generateToolName(pathTemplate, method, operation);
						const toolDescription = this.generateToolDescription(pathTemplate, method, operation);
						
						tools.push({
							name: toolName,
							description: toolDescription,
							method: method.toUpperCase(),
							path: pathTemplate,
							tags: operation.tags || []
						});
					}
				}
			}
		}

		return tools;
	}

	private async getApiInfo(): Promise<string> {
		if (!this.currentSpec) {
			return "No API specification currently loaded.";
		}

		const info = this.currentSpec.info;
		const config = getApiConfig(this.currentApiName || '');
		
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

		return `
📋 Current API: ${info.title} (v${info.version})
📝 Description: ${info.description || 'No description available'}
🔐 Authentication: ${authInfo}
${config?.defaultBaseUrl ? `💡 Default Base URL: ${config.defaultBaseUrl}` : ''}

📊 Statistics:
- ${pathCount} endpoints
- ${operationCount} operations  
- ${tags.size} service tags: ${Array.from(tags).join(', ')}

🔄 Available APIs: ${Object.keys(this.availableSpecs).join(', ')}

💡 Use make_api_call for configured API calls or the generated tools as reference.
		`.trim();
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
