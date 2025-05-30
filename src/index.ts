import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { email } from "zod/v4";
import axios from "axios";

// Define our MCP agent with tools
export class MyMCP extends McpAgent {
  server = new McpServer({
    name: "ChargeNET MCP",
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
                  name: "get_auth_token_bypass",
                  description: "Get an authentication token using bypass configuration"
                },
                {
                  name: "get_auth_token_fetch",
                  description: "Get an authentication token using raw fetch with minimal headers"
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
          const response = await axios.post(`${this.API_BASE_URL}/api/Account/Login`, {
            username: this.USERNAME,
            password: this.PASSWORD,
            loginMode: this.LOGIN_MODE
          }, {
            headers: {
              'Content-Type': 'application/json'
            },
            timeout: 10000 // 10 second timeout
          });

          return {
            content: [
              {
                type: "text",
                text: `Authentication token: ${JSON.stringify(response.data)}`
              }
            ]
          };
        } catch (error: unknown) {
          let errorMessage = 'Unknown error occurred';
          
          if (axios.isAxiosError(error)) {
            errorMessage = `HTTP error! status: ${error.response?.status}, message: ${error.message}`;
            if (error.response?.data) {
              errorMessage += `, response: ${JSON.stringify(error.response.data)}`;
            }
          } else if (error instanceof Error) {
            errorMessage = error.message;
          }
          
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

    // Bypass method to get auth token with different configuration
    this.server.tool(
      "get_auth_token_bypass",
      {},
      async () => {
        try {
          // Create axios instance with custom configuration
          const axiosInstance = axios.create({
            baseURL: this.API_BASE_URL,
            timeout: 15000,
            validateStatus: () => true, // Accept any status code
            headers: {
              'Accept': 'application/json, text/plain, */*',
              'Content-Type': 'application/json',
              'User-Agent': 'axios/1.6.0',
              'Accept-Encoding': 'gzip, compress, deflate, br',
              'Accept-Language': 'en-US,en;q=0.9'
            }
          });

          const response = await axiosInstance.post('/api/Account/Login', {
            username: this.USERNAME,
            password: this.PASSWORD,
            loginMode: this.LOGIN_MODE
          });

          return {
            content: [
              {
                type: "text",
                text: `Bypass response [Status: ${response.status}]: ${JSON.stringify(response.data)}`
              }
            ]
          };
        } catch (error: unknown) {
          let errorMessage = 'Unknown error occurred';
          
          if (axios.isAxiosError(error)) {
            errorMessage = `HTTP error! status: ${error.response?.status}, message: ${error.message}`;
            if (error.response?.data) {
              errorMessage += `, response: ${JSON.stringify(error.response.data)}`;
            }
          } else if (error instanceof Error) {
            errorMessage = error.message;
          }
          
          return {
            content: [
              {
                type: "text",
                text: `Error with bypass method: ${errorMessage}`
              }
            ]
          };
        }
      }
    );

    // Raw fetch method with minimal headers
    this.server.tool(
      "get_auth_token_fetch",
      {},
      async () => {
        try {
          const response = await fetch(`${this.API_BASE_URL}/api/Account/Login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              username: this.USERNAME,
              password: this.PASSWORD,
              loginMode: this.LOGIN_MODE
            })
          });

          const responseText = await response.text();
          
          return {
            content: [
              {
                type: "text",
                text: `Fetch response [Status: ${response.status}]: ${responseText}`
              }
            ]
          };
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
          
          return {
            content: [
              {
                type: "text",
                text: `Error with fetch method: ${errorMessage}`
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
