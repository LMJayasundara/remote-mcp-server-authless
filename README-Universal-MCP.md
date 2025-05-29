# Universal MCP Server for Swagger/OpenAPI

A dynamic MCP (Model Context Protocol) server that automatically generates tools from any Swagger/OpenAPI specification. This server provides a flexible and adaptable interface for interacting with various APIs without manual tool definition.

## 🚀 Features

### ✨ **Dynamic Tool Generation**
- **Automatic parsing** of Swagger/OpenAPI 3.0+ specifications
- **Real-time tool creation** for all API endpoints (GET, POST, PUT, PATCH, DELETE)
- **Intelligent parameter handling** (path, query, header, body parameters)
- **Schema validation** using Zod with automatic type conversion
- **$ref resolution** for complex schema references

### 🔄 **Multi-API Support**
- **Switch between APIs** seamlessly during runtime
- **Maintain separate configurations** for each API
- **Support different authentication methods** per API
- **Context preservation** across API switches

### 🛡️ **Authentication & Security**
- **Bearer token authentication** (JWT)
- **API key authentication** (header-based)
- **Basic authentication** support
- **Custom header configurations**
- **Secure credential management**

### 🎯 **Intelligent Features**
- **Smart tool naming** based on operation IDs, paths, and tags
- **Comprehensive error handling** with helpful suggestions
- **Parameter validation** with descriptive error messages
- **Response formatting** for better readability

## 📁 Project Structure

```
src/
├── universal-mcp.ts          # Main universal MCP server
├── api-config.ts             # API configurations and examples
├── index.ts                  # Original specific MCP implementation
├── swaggers/                 # Swagger/OpenAPI specifications
│   ├── FakeRESTApi.json      # Example REST API spec
│   └── ChargeNET.json        # Example charging network API spec
├── UniversalSystemMessage.md # Universal system prompt
└── SystemMessage.md          # Original system prompt
```

## 🛠️ Setup and Usage

### 1. **Add Your Swagger Files**
Place your Swagger/OpenAPI JSON files in the `src/swaggers/` directory:

```typescript
// The server automatically loads .json files from the swaggers directory
import YourApiSpec from './swaggers/YourApi.json';

// Add to availableSpecs in universal-mcp.ts
this.availableSpecs = {
  'FakeRESTApi': FakeRESTApiSpec as SwaggerSpec,
  'ChargeNET': ChargeNETSpec as SwaggerSpec,
  'YourApi': YourApiSpec as SwaggerSpec  // Add your API here
};
```

### 2. **Configure API Settings**
Update `api-config.ts` with your API configurations:

```typescript
export const API_CONFIGS: Record<string, ApiConfig> = {
  'YourApi': {
    name: 'YourApi',
    displayName: 'Your API Name',
    defaultBaseUrl: 'https://api.yourservice.com',
    authType: 'bearer',  // or 'apikey', 'basic', 'none'
    description: 'Description of your API functionality.'
  }
};
```

### 3. **Deploy and Use**

The server exposes these core management tools:

#### System Tools
- **`list_tools`** - List all available tools and current API info
- **`switch_api`** - Switch to a different API specification
- **`get_api_info`** - Get detailed information about current API
- **`configure_api`** - Set base URL and authentication

#### Dynamic API Tools
All endpoint operations are automatically generated based on the Swagger spec.

## 📚 Usage Examples

### Basic API Discovery
```typescript
// Start by listing available tools and APIs
await listTools();

// Switch to a specific API
await switchApi({ api_name: "FakeRESTApi" });

// Get information about the current API
await getApiInfo();
```

### Configuration
```typescript
// Configure the API base URL and authentication
await configureApi({
  base_url: "https://api.yourservice.com",
  auth_header: "Bearer your-jwt-token-here"
});
```

### Generated Tool Usage
```typescript
// The server automatically generates tools like:
await get_activities();                    // GET /api/v1/Activities
await get_activity_by_id({ id: 1 });      // GET /api/v1/Activities/1
await create_activity({                    // POST /api/v1/Activities
  title: "New Task",
  dueDate: "2024-12-31T23:59:59Z",
  completed: false
});
await update_activity({                    // PUT /api/v1/Activities/1
  id: 1,
  title: "Updated Task"
});
await delete_activity({ id: 1 });         // DELETE /api/v1/Activities/1
```

## 🔧 Advanced Configuration

### Custom Authentication
```typescript
// Bearer Token
await configureApi({
  auth_header: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
});

// API Key
await configureApi({
  api_key: "your-api-key-here"
});

// Custom Headers
await configureApi({
  auth_header: "X-Custom-Auth: your-custom-token"
});
```

### Adding New APIs

1. **Add Swagger JSON file** to `src/swaggers/`
2. **Import and register** in `universal-mcp.ts`
3. **Configure settings** in `api-config.ts`
4. **Redeploy** the server

### Tool Naming Convention

The server uses intelligent naming based on:
- **Operation ID** (if present in Swagger)
- **HTTP Method + Tag + Path segments** (fallback)
- **Sanitized to valid identifiers** (lowercase, underscores)

Examples:
- `GET /api/users` → `get_users`
- `POST /api/users` → `create_user` or `post_users`
- `GET /api/users/{id}` → `get_user_by_id`
- `PUT /api/users/{id}` → `update_user`

## 🌟 Supported Swagger Features

### ✅ **Fully Supported**
- OpenAPI 3.0+ specifications
- Path, query, header, and body parameters
- JSON request/response bodies
- Schema references (`$ref`) resolution
- Basic data types (string, number, boolean, array, object)
- String formats (date-time, email, uri)
- Enums and constraints
- Required vs optional parameters
- Authentication schemes (Bearer, API Key, Basic)

### 🔄 **Partially Supported**
- Complex schema compositions (allOf, oneOf, anyOf)
- Non-JSON content types (limited support)
- File uploads (basic support)

### ❌ **Not Yet Supported**
- Swagger 2.0 specifications (OpenAPI 3.0+ only)
- XML request/response bodies
- Complex authentication flows (OAuth2 flows)
- Callbacks and webhooks

## 🔍 Error Handling

The server provides comprehensive error handling:

### Configuration Errors
- Missing base URL warnings
- Invalid API specification names
- Authentication configuration issues

### Runtime Errors
- HTTP error status codes with descriptions
- Parameter validation errors with suggestions
- Network connectivity issues
- Schema resolution failures

### User-Friendly Messages
- Clear explanation of what went wrong
- Suggestions for fixing common issues
- Alternative approaches when operations fail

## 📈 Performance Considerations

### Optimization Features
- **Schema caching** - Parsed schemas are cached to avoid re-parsing
- **Efficient tool generation** - Tools are generated once per API load
- **Lazy loading** - APIs are loaded only when needed
- **Minimal API calls** - Only necessary requests are made

### Best Practices
- Use appropriate HTTP methods for operations
- Batch related operations when possible
- Cache authentication tokens to avoid repeated auth calls
- Monitor API rate limits and implement backoff strategies

## 🔌 Extension Points

### Adding Custom Tool Logic
```typescript
// Override tool generation for specific patterns
private generateToolForOperation(pathTemplate: string, method: string, operation: PathOperation) {
  // Add custom logic for specific operations
  if (operation.operationId === 'specialOperation') {
    return this.generateSpecialTool(pathTemplate, method, operation);
  }
  
  // Fall back to default generation
  return super.generateToolForOperation(pathTemplate, method, operation);
}
```

### Custom Parameter Processing
```typescript
// Add custom parameter validation or transformation
private processParameters(operation: PathOperation, args: any) {
  // Custom logic for parameter processing
  return processedArgs;
}
```

### Response Post-Processing
```typescript
// Add custom response formatting
private formatResponse(response: any, operation: PathOperation) {
  // Custom formatting logic
  return formattedResponse;
}
```

## 🚀 Deployment

### Local Development
```bash
npm install
npm run dev
```

### Production Deployment
```bash
npm run build
npm run deploy
```

### Cloudflare Workers (Recommended)
The server is optimized for Cloudflare Workers deployment:
- Supports Worker environment APIs
- Efficient cold start times
- Built-in edge caching
- Automatic scaling

## 📊 Monitoring and Debugging

### Logging
- Comprehensive error logging
- API call tracing
- Performance metrics
- Debug information for tool generation

### Health Checks
- API connectivity verification
- Authentication status monitoring
- Schema validation checking
- Tool generation status

## 🔮 Future Enhancements

### Planned Features
- **WebSocket support** for real-time APIs
- **GraphQL integration** for GraphQL APIs
- **AsyncAPI support** for event-driven APIs
- **API versioning** management
- **Rate limiting** and throttling
- **Response caching** strategies
- **API composition** for multi-API workflows

### Community Contributions
We welcome contributions for:
- Additional authentication methods
- New Swagger feature support
- Performance optimizations
- Bug fixes and improvements
- Documentation enhancements

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For questions, issues, or feature requests:
- Open an issue on GitHub
- Check the documentation
- Review existing issues and discussions

---

**Built with ❤️ for the API integration community** 