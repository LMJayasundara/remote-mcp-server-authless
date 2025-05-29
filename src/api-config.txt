// API Configuration for Universal MCP Server
// This file shows how to configure and extend the universal server

export interface ApiConfig {
	name: string;
	displayName: string;
	defaultBaseUrl?: string;
	authType?: 'bearer' | 'apikey' | 'basic' | 'none';
	description?: string;
}

// Configuration for available APIs
export const API_CONFIGS: Record<string, ApiConfig> = {
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

// Default authentication configurations for different auth types
export const AUTH_TEMPLATES = {
	bearer: {
		headerName: 'Authorization',
		valuePrefix: 'Bearer ',
		description: 'JWT or Bearer token authentication'
	},
	apikey: {
		headerName: 'X-API-Key',
		valuePrefix: '',
		description: 'API key authentication'
	},
	basic: {
		headerName: 'Authorization',
		valuePrefix: 'Basic ',
		description: 'Basic authentication (base64 encoded username:password)'
	}
};

// Helper function to get API configuration
export function getApiConfig(apiName: string): ApiConfig | null {
	return API_CONFIGS[apiName] || null;
}

// Helper function to get all available API names
export function getAvailableApis(): string[] {
	return Object.keys(API_CONFIGS);
}

// Helper function to format auth header
export function formatAuthHeader(authType: string, token: string): string {
	const template = AUTH_TEMPLATES[authType as keyof typeof AUTH_TEMPLATES];
	return template ? `${template.valuePrefix}${token}` : token;
}

// Example usage patterns for different APIs
export const USAGE_EXAMPLES = {
	'FakeRESTApi': {
		quickStart: [
			'switch_api: FakeRESTApi',
			'get_api_info',
			'get_activities (or get_books, get_authors, etc.)',
			'create_activity with title: "My New Task"'
		],
		commonOperations: [
			'List all activities: get_activities',
			'Get specific book: get_book_by_id with id: 1',
			'Create new author: create_author with required fields',
			'Update activity: update_activity with id and new data',
			'Delete user: delete_user with id'
		]
	},
	'ChargeNET': {
		quickStart: [
			'switch_api: ChargeNET',
			'configure_api with base_url and auth_header',
			'get_api_info',
			'Use any of the generated charging operations'
		],
		commonOperations: [
			'Authentication: post_account_login',
			'User management: get/post/put/delete user operations',
			'Charging sessions: start/stop charging operations',
			'Location management: location and network operations',
			'Billing: payment and billing group operations'
		]
	}
};

// Tool naming conventions for different API styles
export const NAMING_CONVENTIONS = {
	restful: {
		pattern: '{method}_{resource}_{action?}',
		examples: ['get_users', 'post_user', 'put_user_by_id', 'delete_user']
	},
	rpc: {
		pattern: '{operationId}',
		examples: ['getUserById', 'createUser', 'updateUserProfile']
	},
	hybrid: {
		pattern: '{method}_{tag}_{path_segments}',
		examples: ['get_account_login', 'post_billing_payment', 'put_location_network']
	}
}; 