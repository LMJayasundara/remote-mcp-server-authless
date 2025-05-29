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
	content: Record<string, { 
		schema: SchemaObject;
		encoding?: Record<string, any>;
	}>;
	required?: boolean;
}

interface Response {
	description: string;
	content?: Record<string, { 
		schema: SchemaObject;
		encoding?: Record<string, any>;
	}>;
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
	default?: any;
	readOnly?: boolean;
	writeOnly?: boolean;
	example?: any;
	examples?: any[];
	minimum?: number;
	maximum?: number;
	exclusiveMinimum?: boolean | number;
	exclusiveMaximum?: boolean | number;
	minLength?: number;
	maxLength?: number;
	pattern?: string;
	minItems?: number;
	maxItems?: number;
	uniqueItems?: boolean;
	multipleOf?: number;
	minProperties?: number;
	maxProperties?: number;
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
    "openapi": "3.0.1",
    "info": {
      "title": "FakeRESTApi.Web V1",
      "version": "v1"
    },
    "paths": {
      "/api/v1/Activities": {
        "get": {
          "tags": [
            "Activities"
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "text/plain; v=1.0": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/Activity"
                    }
                  }
                },
                "application/json; v=1.0": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/Activity"
                    }
                  }
                },
                "text/json; v=1.0": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/Activity"
                    }
                  }
                }
              }
            }
          }
        },
        "post": {
          "tags": [
            "Activities"
          ],
          "requestBody": {
            "content": {
              "application/json; v=1.0": {
                "schema": {
                  "$ref": "#/components/schemas/Activity"
                }
              },
              "text/json; v=1.0": {
                "schema": {
                  "$ref": "#/components/schemas/Activity"
                }
              },
              "application/*+json; v=1.0": {
                "schema": {
                  "$ref": "#/components/schemas/Activity"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "text/plain; v=1.0": {
                  "schema": {
                    "$ref": "#/components/schemas/Activity"
                  }
                },
                "application/json; v=1.0": {
                  "schema": {
                    "$ref": "#/components/schemas/Activity"
                  }
                },
                "text/json; v=1.0": {
                  "schema": {
                    "$ref": "#/components/schemas/Activity"
                  }
                }
              }
            }
          }
        }
      },
      "/api/v1/Activities/{id}": {
        "get": {
          "tags": [
            "Activities"
          ],
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "text/plain; v=1.0": {
                  "schema": {
                    "$ref": "#/components/schemas/Activity"
                  }
                },
                "application/json; v=1.0": {
                  "schema": {
                    "$ref": "#/components/schemas/Activity"
                  }
                },
                "text/json; v=1.0": {
                  "schema": {
                    "$ref": "#/components/schemas/Activity"
                  }
                }
              }
            }
          }
        },
        "put": {
          "tags": [
            "Activities"
          ],
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "requestBody": {
            "content": {
              "application/json; v=1.0": {
                "schema": {
                  "$ref": "#/components/schemas/Activity"
                }
              },
              "text/json; v=1.0": {
                "schema": {
                  "$ref": "#/components/schemas/Activity"
                }
              },
              "application/*+json; v=1.0": {
                "schema": {
                  "$ref": "#/components/schemas/Activity"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "text/plain; v=1.0": {
                  "schema": {
                    "$ref": "#/components/schemas/Activity"
                  }
                },
                "application/json; v=1.0": {
                  "schema": {
                    "$ref": "#/components/schemas/Activity"
                  }
                },
                "text/json; v=1.0": {
                  "schema": {
                    "$ref": "#/components/schemas/Activity"
                  }
                }
              }
            }
          }
        },
        "delete": {
          "tags": [
            "Activities"
          ],
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/v1/Authors": {
        "get": {
          "tags": [
            "Authors"
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "text/plain; v=1.0": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/Author"
                    }
                  }
                },
                "application/json; v=1.0": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/Author"
                    }
                  }
                },
                "text/json; v=1.0": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/Author"
                    }
                  }
                }
              }
            }
          }
        },
        "post": {
          "tags": [
            "Authors"
          ],
          "requestBody": {
            "content": {
              "application/json; v=1.0": {
                "schema": {
                  "$ref": "#/components/schemas/Author"
                }
              },
              "text/json; v=1.0": {
                "schema": {
                  "$ref": "#/components/schemas/Author"
                }
              },
              "application/*+json; v=1.0": {
                "schema": {
                  "$ref": "#/components/schemas/Author"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "text/plain; v=1.0": {
                  "schema": {
                    "$ref": "#/components/schemas/Author"
                  }
                },
                "application/json; v=1.0": {
                  "schema": {
                    "$ref": "#/components/schemas/Author"
                  }
                },
                "text/json; v=1.0": {
                  "schema": {
                    "$ref": "#/components/schemas/Author"
                  }
                }
              }
            }
          }
        }
      },
      "/api/v1/Authors/authors/books/{idBook}": {
        "get": {
          "tags": [
            "Authors"
          ],
          "parameters": [
            {
              "name": "idBook",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "text/plain; v=1.0": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/Author"
                    }
                  }
                },
                "application/json; v=1.0": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/Author"
                    }
                  }
                },
                "text/json; v=1.0": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/Author"
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/api/v1/Authors/{id}": {
        "get": {
          "tags": [
            "Authors"
          ],
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "text/plain; v=1.0": {
                  "schema": {
                    "$ref": "#/components/schemas/Author"
                  }
                },
                "application/json; v=1.0": {
                  "schema": {
                    "$ref": "#/components/schemas/Author"
                  }
                },
                "text/json; v=1.0": {
                  "schema": {
                    "$ref": "#/components/schemas/Author"
                  }
                }
              }
            }
          }
        },
        "put": {
          "tags": [
            "Authors"
          ],
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "requestBody": {
            "content": {
              "application/json; v=1.0": {
                "schema": {
                  "$ref": "#/components/schemas/Author"
                }
              },
              "text/json; v=1.0": {
                "schema": {
                  "$ref": "#/components/schemas/Author"
                }
              },
              "application/*+json; v=1.0": {
                "schema": {
                  "$ref": "#/components/schemas/Author"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "text/plain; v=1.0": {
                  "schema": {
                    "$ref": "#/components/schemas/Author"
                  }
                },
                "application/json; v=1.0": {
                  "schema": {
                    "$ref": "#/components/schemas/Author"
                  }
                },
                "text/json; v=1.0": {
                  "schema": {
                    "$ref": "#/components/schemas/Author"
                  }
                }
              }
            }
          }
        },
        "delete": {
          "tags": [
            "Authors"
          ],
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/v1/Books": {
        "get": {
          "tags": [
            "Books"
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "text/plain; v=1.0": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/Book"
                    }
                  }
                },
                "application/json; v=1.0": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/Book"
                    }
                  }
                },
                "text/json; v=1.0": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/Book"
                    }
                  }
                }
              }
            }
          }
        },
        "post": {
          "tags": [
            "Books"
          ],
          "requestBody": {
            "content": {
              "application/json; v=1.0": {
                "schema": {
                  "$ref": "#/components/schemas/Book"
                }
              },
              "text/json; v=1.0": {
                "schema": {
                  "$ref": "#/components/schemas/Book"
                }
              },
              "application/*+json; v=1.0": {
                "schema": {
                  "$ref": "#/components/schemas/Book"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/v1/Books/{id}": {
        "get": {
          "tags": [
            "Books"
          ],
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "text/plain; v=1.0": {
                  "schema": {
                    "$ref": "#/components/schemas/Book"
                  }
                },
                "application/json; v=1.0": {
                  "schema": {
                    "$ref": "#/components/schemas/Book"
                  }
                },
                "text/json; v=1.0": {
                  "schema": {
                    "$ref": "#/components/schemas/Book"
                  }
                }
              }
            }
          }
        },
        "put": {
          "tags": [
            "Books"
          ],
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "requestBody": {
            "content": {
              "application/json; v=1.0": {
                "schema": {
                  "$ref": "#/components/schemas/Book"
                }
              },
              "text/json; v=1.0": {
                "schema": {
                  "$ref": "#/components/schemas/Book"
                }
              },
              "application/*+json; v=1.0": {
                "schema": {
                  "$ref": "#/components/schemas/Book"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        },
        "delete": {
          "tags": [
            "Books"
          ],
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/v1/CoverPhotos": {
        "get": {
          "tags": [
            "CoverPhotos"
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "text/plain; v=1.0": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/CoverPhoto"
                    }
                  }
                },
                "application/json; v=1.0": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/CoverPhoto"
                    }
                  }
                },
                "text/json; v=1.0": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/CoverPhoto"
                    }
                  }
                }
              }
            }
          }
        },
        "post": {
          "tags": [
            "CoverPhotos"
          ],
          "requestBody": {
            "content": {
              "application/json; v=1.0": {
                "schema": {
                  "$ref": "#/components/schemas/CoverPhoto"
                }
              },
              "text/json; v=1.0": {
                "schema": {
                  "$ref": "#/components/schemas/CoverPhoto"
                }
              },
              "application/*+json; v=1.0": {
                "schema": {
                  "$ref": "#/components/schemas/CoverPhoto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "text/plain; v=1.0": {
                  "schema": {
                    "$ref": "#/components/schemas/CoverPhoto"
                  }
                },
                "application/json; v=1.0": {
                  "schema": {
                    "$ref": "#/components/schemas/CoverPhoto"
                  }
                },
                "text/json; v=1.0": {
                  "schema": {
                    "$ref": "#/components/schemas/CoverPhoto"
                  }
                }
              }
            }
          }
        }
      },
      "/api/v1/CoverPhotos/books/covers/{idBook}": {
        "get": {
          "tags": [
            "CoverPhotos"
          ],
          "parameters": [
            {
              "name": "idBook",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "text/plain; v=1.0": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/CoverPhoto"
                    }
                  }
                },
                "application/json; v=1.0": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/CoverPhoto"
                    }
                  }
                },
                "text/json; v=1.0": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/CoverPhoto"
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/api/v1/CoverPhotos/{id}": {
        "get": {
          "tags": [
            "CoverPhotos"
          ],
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "text/plain; v=1.0": {
                  "schema": {
                    "$ref": "#/components/schemas/CoverPhoto"
                  }
                },
                "application/json; v=1.0": {
                  "schema": {
                    "$ref": "#/components/schemas/CoverPhoto"
                  }
                },
                "text/json; v=1.0": {
                  "schema": {
                    "$ref": "#/components/schemas/CoverPhoto"
                  }
                }
              }
            }
          }
        },
        "put": {
          "tags": [
            "CoverPhotos"
          ],
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "requestBody": {
            "content": {
              "application/json; v=1.0": {
                "schema": {
                  "$ref": "#/components/schemas/CoverPhoto"
                }
              },
              "text/json; v=1.0": {
                "schema": {
                  "$ref": "#/components/schemas/CoverPhoto"
                }
              },
              "application/*+json; v=1.0": {
                "schema": {
                  "$ref": "#/components/schemas/CoverPhoto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "text/plain; v=1.0": {
                  "schema": {
                    "$ref": "#/components/schemas/CoverPhoto"
                  }
                },
                "application/json; v=1.0": {
                  "schema": {
                    "$ref": "#/components/schemas/CoverPhoto"
                  }
                },
                "text/json; v=1.0": {
                  "schema": {
                    "$ref": "#/components/schemas/CoverPhoto"
                  }
                }
              }
            }
          }
        },
        "delete": {
          "tags": [
            "CoverPhotos"
          ],
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/v1/Users": {
        "get": {
          "tags": [
            "Users"
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "text/plain; v=1.0": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/User"
                    }
                  }
                },
                "application/json; v=1.0": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/User"
                    }
                  }
                },
                "text/json; v=1.0": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/User"
                    }
                  }
                }
              }
            }
          }
        },
        "post": {
          "tags": [
            "Users"
          ],
          "requestBody": {
            "content": {
              "application/json; v=1.0": {
                "schema": {
                  "$ref": "#/components/schemas/User"
                }
              },
              "text/json; v=1.0": {
                "schema": {
                  "$ref": "#/components/schemas/User"
                }
              },
              "application/*+json; v=1.0": {
                "schema": {
                  "$ref": "#/components/schemas/User"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/v1/Users/{id}": {
        "get": {
          "tags": [
            "Users"
          ],
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        },
        "put": {
          "tags": [
            "Users"
          ],
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "requestBody": {
            "content": {
              "application/json; v=1.0": {
                "schema": {
                  "$ref": "#/components/schemas/User"
                }
              },
              "text/json; v=1.0": {
                "schema": {
                  "$ref": "#/components/schemas/User"
                }
              },
              "application/*+json; v=1.0": {
                "schema": {
                  "$ref": "#/components/schemas/User"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        },
        "delete": {
          "tags": [
            "Users"
          ],
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      }
    },
    "components": {
      "schemas": {
        "Activity": {
          "type": "object",
          "properties": {
            "id": {
              "type": "integer",
              "format": "int32"
            },
            "title": {
              "type": "string",
              "nullable": true
            },
            "dueDate": {
              "type": "string",
              "format": "date-time"
            },
            "completed": {
              "type": "boolean"
            }
          },
          "additionalProperties": false
        },
        "Author": {
          "type": "object",
          "properties": {
            "id": {
              "type": "integer",
              "format": "int32"
            },
            "idBook": {
              "type": "integer",
              "format": "int32"
            },
            "firstName": {
              "type": "string",
              "nullable": true
            },
            "lastName": {
              "type": "string",
              "nullable": true
            }
          },
          "additionalProperties": false
        },
        "Book": {
          "type": "object",
          "properties": {
            "id": {
              "type": "integer",
              "format": "int32"
            },
            "title": {
              "type": "string",
              "nullable": true
            },
            "description": {
              "type": "string",
              "nullable": true
            },
            "pageCount": {
              "type": "integer",
              "format": "int32"
            },
            "excerpt": {
              "type": "string",
              "nullable": true
            },
            "publishDate": {
              "type": "string",
              "format": "date-time"
            }
          },
          "additionalProperties": false
        },
        "CoverPhoto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "integer",
              "format": "int32"
            },
            "idBook": {
              "type": "integer",
              "format": "int32"
            },
            "url": {
              "type": "string",
              "format": "uri",
              "nullable": true
            }
          },
          "additionalProperties": false
        },
        "User": {
          "type": "object",
          "properties": {
            "id": {
              "type": "integer",
              "format": "int32"
            },
            "userName": {
              "type": "string",
              "nullable": true
            },
            "password": {
              "type": "string",
              "nullable": true
            }
          },
          "additionalProperties": false
        }
      }
    }
  },
  'ChargeNET': {
    "openapi": "3.0.1",
    "info": {
      "title": "ChargeNET Gen.2 API Server",
      "description": "Vega - ChargeNET Generation 2 web-application revamp API definitions.",
      "version": "v2"
    },
    "paths": {
      "/api/Account/Login": {
        "post": {
          "tags": [
            "Account"
          ],
          "requestBody": {
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/LoginModel"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/LoginModel"
                }
              },
              "application/*+json": {
                "schema": {
                  "$ref": "#/components/schemas/LoginModel"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Account/Logout/{requestToken}": {
        "post": {
          "tags": [
            "Account"
          ],
          "parameters": [
            {
              "name": "requestToken",
              "in": "path",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/LoginModel"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/LoginModel"
                }
              },
              "application/*+json": {
                "schema": {
                  "$ref": "#/components/schemas/LoginModel"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Account/RefreshTokens": {
        "post": {
          "tags": [
            "Account"
          ],
          "requestBody": {
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/IdentityUser"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/IdentityUser"
                }
              },
              "application/*+json": {
                "schema": {
                  "$ref": "#/components/schemas/IdentityUser"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Account/ResetPassword": {
        "patch": {
          "tags": [
            "Account"
          ],
          "requestBody": {
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/RecoveryModel"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/RecoveryModel"
                }
              },
              "application/*+json": {
                "schema": {
                  "$ref": "#/components/schemas/RecoveryModel"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Account/SetPassword/{requestToken}": {
        "patch": {
          "tags": [
            "Account"
          ],
          "parameters": [
            {
              "name": "requestToken",
              "in": "path",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/RecoveryModel"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/RecoveryModel"
                }
              },
              "application/*+json": {
                "schema": {
                  "$ref": "#/components/schemas/RecoveryModel"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Account/GoogleLogin/{requestToken}": {
        "post": {
          "tags": [
            "Account"
          ],
          "parameters": [
            {
              "name": "requestToken",
              "in": "path",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ExternalLoginModel"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/ExternalLoginModel"
                }
              },
              "application/*+json": {
                "schema": {
                  "$ref": "#/components/schemas/ExternalLoginModel"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Account/LoginWithApple/{requestToken}": {
        "post": {
          "tags": [
            "Account"
          ],
          "parameters": [
            {
              "name": "requestToken",
              "in": "path",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AppleLoginModel"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/AppleLoginModel"
                }
              },
              "application/*+json": {
                "schema": {
                  "$ref": "#/components/schemas/AppleLoginModel"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Advertisement/Get/ById/{advertisementId}": {
        "get": {
          "tags": [
            "Advertisement"
          ],
          "parameters": [
            {
              "name": "advertisementId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Advertisement/Get/ByCompany/{companyId}": {
        "get": {
          "tags": [
            "Advertisement"
          ],
          "parameters": [
            {
              "name": "companyId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "excludeExpired",
              "in": "query",
              "schema": {
                "type": "boolean",
                "default": true
              }
            },
            {
              "name": "promotionId",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "title",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "publisher",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "createdDate",
              "in": "query",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "expireDate",
              "in": "query",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "Page",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "Size",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Advertisement/Get/ByPublisher/{publisherId}": {
        "get": {
          "tags": [
            "Advertisement"
          ],
          "parameters": [
            {
              "name": "publisherId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "excludeExpired",
              "in": "query",
              "schema": {
                "type": "boolean",
                "default": true
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Advertisement/Create": {
        "post": {
          "tags": [
            "Advertisement"
          ],
          "requestBody": {
            "content": {
              "multipart/form-data": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "Title": {
                      "type": "string"
                    },
                    "Description": {
                      "type": "string"
                    },
                    "BannerImage": {
                      "type": "string",
                      "format": "binary"
                    },
                    "ExpireAfterDays": {
                      "type": "integer",
                      "format": "int32"
                    }
                  }
                },
                "encoding": {
                  "Title": {
                    "style": "form"
                  },
                  "Description": {
                    "style": "form"
                  },
                  "BannerImage": {
                    "style": "form"
                  },
                  "ExpireAfterDays": {
                    "style": "form"
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Advertisement/Remove/{advertisementId}": {
        "delete": {
          "tags": [
            "Advertisement"
          ],
          "parameters": [
            {
              "name": "advertisementId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Advertisement/{advertisementId}/clicks": {
        "post": {
          "tags": [
            "Advertisement"
          ],
          "parameters": [
            {
              "name": "advertisementId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/ChargePoint/GetChargePoint/ById/{chargePointId}": {
        "get": {
          "tags": [
            "ChargePoint"
          ],
          "parameters": [
            {
              "name": "chargePointId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/ChargePoint/GetAll": {
        "get": {
          "tags": [
            "ChargePoint"
          ],
          "parameters": [
            {
              "name": "Reference",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "From",
              "in": "query",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "To",
              "in": "query",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "AllowPublic",
              "in": "query",
              "schema": {
                "type": "boolean"
              }
            },
            {
              "name": "Type",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "Network",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "Company",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "Page",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "Size",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/ChargePoint/GetChargePoint/ByCompany/{companyId}": {
        "get": {
          "tags": [
            "ChargePoint"
          ],
          "parameters": [
            {
              "name": "companyId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "Reference",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "From",
              "in": "query",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "To",
              "in": "query",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "AllowPublic",
              "in": "query",
              "schema": {
                "type": "boolean"
              }
            },
            {
              "name": "Type",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "Network",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "Company",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "Page",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "Size",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/ChargePoint/GetLazyChargePoint/ByCompany/{companyId}": {
        "get": {
          "tags": [
            "ChargePoint"
          ],
          "parameters": [
            {
              "name": "companyId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "Reference",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "From",
              "in": "query",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "To",
              "in": "query",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "AllowPublic",
              "in": "query",
              "schema": {
                "type": "boolean"
              }
            },
            {
              "name": "Type",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "Network",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "Company",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "Page",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "Size",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/ChargePoint/GetChargePoints/ForUser": {
        "get": {
          "tags": [
            "ChargePoint"
          ],
          "parameters": [
            {
              "name": "Reference",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "From",
              "in": "query",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "To",
              "in": "query",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "AllowPublic",
              "in": "query",
              "schema": {
                "type": "boolean"
              }
            },
            {
              "name": "Type",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "Network",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "Company",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "Page",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "Size",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "groupBy",
              "in": "query",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/ChargePoint/GetChargePointsByCompanyUser": {
        "get": {
          "tags": [
            "ChargePoint"
          ],
          "parameters": [
            {
              "name": "lazyLoad",
              "in": "query",
              "schema": {
                "type": "boolean",
                "default": false
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/ChargePoint/GetChargePoint/ByOwner/{ownerId}": {
        "get": {
          "tags": [
            "ChargePoint"
          ],
          "parameters": [
            {
              "name": "ownerId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "Reference",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "From",
              "in": "query",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "To",
              "in": "query",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "AllowPublic",
              "in": "query",
              "schema": {
                "type": "boolean"
              }
            },
            {
              "name": "Type",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "Network",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "Company",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "Page",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "Size",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/ChargePoint/Create": {
        "post": {
          "tags": [
            "ChargePoint"
          ],
          "requestBody": {
            "content": {
              "multipart/form-data": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "Reference": {
                      "type": "string"
                    },
                    "ChargeNetworkId": {
                      "type": "integer",
                      "format": "int32"
                    },
                    "ChargerLocationId": {
                      "type": "integer",
                      "format": "int32"
                    },
                    "ChargerTypeId": {
                      "type": "integer",
                      "format": "int32"
                    },
                    "Image": {
                      "type": "string",
                      "format": "binary"
                    },
                    "ImageUrl": {
                      "type": "string"
                    },
                    "TariffModeId": {
                      "type": "integer",
                      "format": "int32"
                    },
                    "IsShown": {
                      "type": "boolean"
                    },
                    "MinimumBalance": {
                      "type": "number",
                      "format": "double"
                    },
                    "UnitCostOutside": {
                      "type": "number",
                      "format": "double"
                    },
                    "UnitCostInNetwork": {
                      "type": "number",
                      "format": "double"
                    },
                    "UnitCostOutNetwork": {
                      "type": "number",
                      "format": "double"
                    },
                    "IsSupportOCPP": {
                      "type": "boolean"
                    },
                    "IsDualPort": {
                      "type": "boolean"
                    },
                    "AllowPublicCharging": {
                      "type": "boolean"
                    },
                    "Password": {
                      "type": "string"
                    },
                    "TariffRates": {
                      "type": "string"
                    },
                    "Description": {
                      "type": "string"
                    },
                    "Tags": {
                      "type": "string"
                    }
                  }
                },
                "encoding": {
                  "Reference": {
                    "style": "form"
                  },
                  "ChargeNetworkId": {
                    "style": "form"
                  },
                  "ChargerLocationId": {
                    "style": "form"
                  },
                  "ChargerTypeId": {
                    "style": "form"
                  },
                  "Image": {
                    "style": "form"
                  },
                  "ImageUrl": {
                    "style": "form"
                  },
                  "TariffModeId": {
                    "style": "form"
                  },
                  "IsShown": {
                    "style": "form"
                  },
                  "MinimumBalance": {
                    "style": "form"
                  },
                  "UnitCostOutside": {
                    "style": "form"
                  },
                  "UnitCostInNetwork": {
                    "style": "form"
                  },
                  "UnitCostOutNetwork": {
                    "style": "form"
                  },
                  "IsSupportOCPP": {
                    "style": "form"
                  },
                  "IsDualPort": {
                    "style": "form"
                  },
                  "AllowPublicCharging": {
                    "style": "form"
                  },
                  "Password": {
                    "style": "form"
                  },
                  "TariffRates": {
                    "style": "form"
                  },
                  "Description": {
                    "style": "form"
                  },
                  "Tags": {
                    "style": "form"
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/ChargePoint/Update/{chargePointId}": {
        "put": {
          "tags": [
            "ChargePoint"
          ],
          "parameters": [
            {
              "name": "chargePointId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "requestBody": {
            "content": {
              "multipart/form-data": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "Reference": {
                      "type": "string"
                    },
                    "ChargeNetworkId": {
                      "type": "integer",
                      "format": "int32"
                    },
                    "ChargerLocationId": {
                      "type": "integer",
                      "format": "int32"
                    },
                    "ChargerTypeId": {
                      "type": "integer",
                      "format": "int32"
                    },
                    "Image": {
                      "type": "string",
                      "format": "binary"
                    },
                    "ImageUrl": {
                      "type": "string"
                    },
                    "TariffModeId": {
                      "type": "integer",
                      "format": "int32"
                    },
                    "IsShown": {
                      "type": "boolean"
                    },
                    "MinimumBalance": {
                      "type": "number",
                      "format": "double"
                    },
                    "UnitCostOutside": {
                      "type": "number",
                      "format": "double"
                    },
                    "UnitCostInNetwork": {
                      "type": "number",
                      "format": "double"
                    },
                    "UnitCostOutNetwork": {
                      "type": "number",
                      "format": "double"
                    },
                    "IsSupportOCPP": {
                      "type": "boolean"
                    },
                    "IsDualPort": {
                      "type": "boolean"
                    },
                    "AllowPublicCharging": {
                      "type": "boolean"
                    },
                    "Password": {
                      "type": "string"
                    },
                    "TariffRates": {
                      "type": "string"
                    },
                    "Description": {
                      "type": "string"
                    },
                    "Tags": {
                      "type": "string"
                    }
                  }
                },
                "encoding": {
                  "Reference": {
                    "style": "form"
                  },
                  "ChargeNetworkId": {
                    "style": "form"
                  },
                  "ChargerLocationId": {
                    "style": "form"
                  },
                  "ChargerTypeId": {
                    "style": "form"
                  },
                  "Image": {
                    "style": "form"
                  },
                  "ImageUrl": {
                    "style": "form"
                  },
                  "TariffModeId": {
                    "style": "form"
                  },
                  "IsShown": {
                    "style": "form"
                  },
                  "MinimumBalance": {
                    "style": "form"
                  },
                  "UnitCostOutside": {
                    "style": "form"
                  },
                  "UnitCostInNetwork": {
                    "style": "form"
                  },
                  "UnitCostOutNetwork": {
                    "style": "form"
                  },
                  "IsSupportOCPP": {
                    "style": "form"
                  },
                  "IsDualPort": {
                    "style": "form"
                  },
                  "AllowPublicCharging": {
                    "style": "form"
                  },
                  "Password": {
                    "style": "form"
                  },
                  "TariffRates": {
                    "style": "form"
                  },
                  "Description": {
                    "style": "form"
                  },
                  "Tags": {
                    "style": "form"
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/ChargePoint/Remove/{chargePointId}": {
        "delete": {
          "tags": [
            "ChargePoint"
          ],
          "parameters": [
            {
              "name": "chargePointId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/ChargePoint/GetEvse/{evseId}": {
        "get": {
          "tags": [
            "ChargePoint"
          ],
          "parameters": [
            {
              "name": "evseId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/ChargePoint/GetEvse/ByChargePoint/{chargePointId}": {
        "get": {
          "tags": [
            "ChargePoint"
          ],
          "parameters": [
            {
              "name": "chargePointId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "Reference",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "Port",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "Page",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "Size",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/ChargePoint/AddEvseModule": {
        "post": {
          "tags": [
            "ChargePoint"
          ],
          "requestBody": {
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ChargerEVSE"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/ChargerEVSE"
                }
              },
              "application/*+json": {
                "schema": {
                  "$ref": "#/components/schemas/ChargerEVSE"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/ChargePoint/UpdateEvseModule/{evseId}": {
        "put": {
          "tags": [
            "ChargePoint"
          ],
          "parameters": [
            {
              "name": "evseId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "requestBody": {
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ChargerEVSE"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/ChargerEVSE"
                }
              },
              "application/*+json": {
                "schema": {
                  "$ref": "#/components/schemas/ChargerEVSE"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/ChargePoint/RemoveEvseModule/{evseId}": {
        "delete": {
          "tags": [
            "ChargePoint"
          ],
          "parameters": [
            {
              "name": "evseId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/ChargePoint/GetConnector/{connectorId}": {
        "get": {
          "tags": [
            "ChargePoint"
          ],
          "parameters": [
            {
              "name": "connectorId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/ChargePoint/GetConnector/ByEvse/{evseId}": {
        "get": {
          "tags": [
            "ChargePoint"
          ],
          "parameters": [
            {
              "name": "evseId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "Reference",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "Port",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "Connector",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "Page",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "Size",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/ChargePoint/AddConnector": {
        "post": {
          "tags": [
            "ChargePoint"
          ],
          "requestBody": {
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ConnectorModel"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/ConnectorModel"
                }
              },
              "application/*+json": {
                "schema": {
                  "$ref": "#/components/schemas/ConnectorModel"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/ChargePoint/UpdateConnector/{connectorId}": {
        "put": {
          "tags": [
            "ChargePoint"
          ],
          "parameters": [
            {
              "name": "connectorId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "requestBody": {
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ConnectorModel"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/ConnectorModel"
                }
              },
              "application/*+json": {
                "schema": {
                  "$ref": "#/components/schemas/ConnectorModel"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/ChargePoint/RemoveConnector/{connectorId}": {
        "delete": {
          "tags": [
            "ChargePoint"
          ],
          "parameters": [
            {
              "name": "connectorId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/ChargePoint/GetConnectorTypes": {
        "get": {
          "tags": [
            "ChargePoint"
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/ChargePoint/FavouriteCharger/Add": {
        "post": {
          "tags": [
            "ChargePoint"
          ],
          "requestBody": {
            "content": {
              "multipart/form-data": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "chargerId": {
                      "type": "integer",
                      "format": "int32"
                    },
                    "userId": {
                      "type": "integer",
                      "format": "int32"
                    }
                  }
                },
                "encoding": {
                  "chargerId": {
                    "style": "form"
                  },
                  "userId": {
                    "style": "form"
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/ChargePoint/FavouriteCharger/Remove": {
        "delete": {
          "tags": [
            "ChargePoint"
          ],
          "requestBody": {
            "content": {
              "multipart/form-data": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "chargerId": {
                      "type": "integer",
                      "format": "int32"
                    },
                    "userId": {
                      "type": "integer",
                      "format": "int32"
                    }
                  }
                },
                "encoding": {
                  "chargerId": {
                    "style": "form"
                  },
                  "userId": {
                    "style": "form"
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/ChargePoint/FavouriteChargers/{userId}": {
        "get": {
          "tags": [
            "ChargePoint"
          ],
          "parameters": [
            {
              "name": "userId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/ChargePoint/Rate/{chargerId}": {
        "patch": {
          "tags": [
            "ChargePoint"
          ],
          "parameters": [
            {
              "name": "chargerId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "requestBody": {
            "content": {
              "multipart/form-data": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "rateScore": {
                      "type": "number",
                      "format": "double"
                    }
                  }
                },
                "encoding": {
                  "rateScore": {
                    "style": "form"
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/ChargePoint/checkChargerPointReference/{userId}": {
        "get": {
          "tags": [
            "ChargePoint"
          ],
          "parameters": [
            {
              "name": "userId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "chargerReference",
              "in": "query",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/ChargePoint/GetHeartbeatOfChargers/{userId}": {
        "get": {
          "tags": [
            "ChargePoint"
          ],
          "parameters": [
            {
              "name": "userId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/ChargePoint/GetChargePoint/{companyId}": {
        "get": {
          "tags": [
            "ChargePoint"
          ],
          "parameters": [
            {
              "name": "companyId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/ChargePoint/GetOCPPChargerDetails": {
        "get": {
          "tags": [
            "ChargePoint"
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/ChargerType/GetChargerType/{chargerTypeId}": {
        "get": {
          "tags": [
            "ChargerType"
          ],
          "parameters": [
            {
              "name": "chargerTypeId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/ChargerType/GetAll": {
        "get": {
          "tags": [
            "ChargerType"
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/ChargeSession/AuthenticateCharger": {
        "post": {
          "tags": [
            "ChargeSession"
          ],
          "requestBody": {
            "content": {
              "multipart/form-data": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "chargerReference": {
                      "type": "string"
                    },
                    "password": {
                      "type": "string"
                    }
                  }
                },
                "encoding": {
                  "chargerReference": {
                    "style": "form"
                  },
                  "password": {
                    "style": "form"
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/ChargeSession/Start": {
        "post": {
          "tags": [
            "ChargeSession"
          ],
          "requestBody": {
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ChargeSessionStartModel"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/ChargeSessionStartModel"
                }
              },
              "application/*+json": {
                "schema": {
                  "$ref": "#/components/schemas/ChargeSessionStartModel"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/ChargeSession/Stop": {
        "post": {
          "tags": [
            "ChargeSession"
          ],
          "requestBody": {
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ChargeSessionEndModel"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/ChargeSessionEndModel"
                }
              },
              "application/*+json": {
                "schema": {
                  "$ref": "#/components/schemas/ChargeSessionEndModel"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/ChargeSession/GetSession/{sessionId}": {
        "get": {
          "tags": [
            "ChargeSession"
          ],
          "parameters": [
            {
              "name": "sessionId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/ChargeSession/GetSessions/ByUser/{userId}": {
        "get": {
          "tags": [
            "ChargeSession"
          ],
          "parameters": [
            {
              "name": "userId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "SessionId",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "ChargerReference",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "TariffMode",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "Status",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "Username",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "From",
              "in": "query",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "To",
              "in": "query",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "MinimumAmount",
              "in": "query",
              "schema": {
                "type": "number",
                "format": "double"
              }
            },
            {
              "name": "MaximumAmount",
              "in": "query",
              "schema": {
                "type": "number",
                "format": "double"
              }
            },
            {
              "name": "RecordCount",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "ZeroTransactions",
              "in": "query",
              "schema": {
                "type": "boolean"
              }
            },
            {
              "name": "Page",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "Size",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/ChargeSession/GetOngoingSession/{userId}": {
        "get": {
          "tags": [
            "ChargeSession"
          ],
          "parameters": [
            {
              "name": "userId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/ChargeSession/UserAuthentication/{chargerReference}": {
        "post": {
          "tags": [
            "ChargeSession"
          ],
          "parameters": [
            {
              "name": "chargerReference",
              "in": "path",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UserAuthModel"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/UserAuthModel"
                }
              },
              "application/*+json": {
                "schema": {
                  "$ref": "#/components/schemas/UserAuthModel"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/ChargeSession/GetSessions/ByCompany/{companyId}": {
        "get": {
          "tags": [
            "ChargeSession"
          ],
          "parameters": [
            {
              "name": "companyId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "SessionId",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "ChargerReference",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "TariffMode",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "Status",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "Username",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "From",
              "in": "query",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "To",
              "in": "query",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "MinimumAmount",
              "in": "query",
              "schema": {
                "type": "number",
                "format": "double"
              }
            },
            {
              "name": "MaximumAmount",
              "in": "query",
              "schema": {
                "type": "number",
                "format": "double"
              }
            },
            {
              "name": "RecordCount",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "ZeroTransactions",
              "in": "query",
              "schema": {
                "type": "boolean"
              }
            },
            {
              "name": "Page",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "Size",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/ChargeSession/GetSessions/ByNetworkOwner": {
        "get": {
          "tags": [
            "ChargeSession"
          ],
          "parameters": [
            {
              "name": "SessionId",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "ChargerReference",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "TariffMode",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "Status",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "Username",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "From",
              "in": "query",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "To",
              "in": "query",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "MinimumAmount",
              "in": "query",
              "schema": {
                "type": "number",
                "format": "double"
              }
            },
            {
              "name": "MaximumAmount",
              "in": "query",
              "schema": {
                "type": "number",
                "format": "double"
              }
            },
            {
              "name": "RecordCount",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "ZeroTransactions",
              "in": "query",
              "schema": {
                "type": "boolean"
              }
            },
            {
              "name": "Page",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "Size",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/ChargeSession/Update/{sessionId}": {
        "put": {
          "tags": [
            "ChargeSession"
          ],
          "parameters": [
            {
              "name": "sessionId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ChargeSession"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/ChargeSession"
                }
              },
              "application/*+json": {
                "schema": {
                  "$ref": "#/components/schemas/ChargeSession"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/ChargeSession/Remove/{Id}": {
        "delete": {
          "tags": [
            "ChargeSession"
          ],
          "parameters": [
            {
              "name": "Id",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/ChargeSession/Rating/{sessionId}": {
        "put": {
          "tags": [
            "ChargeSession"
          ],
          "parameters": [
            {
              "name": "sessionId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "content": {
              "multipart/form-data": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "rate": {
                      "type": "integer",
                      "format": "int32"
                    }
                  }
                },
                "encoding": {
                  "rate": {
                    "style": "form"
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/ChargeSession/RecentChargePoint/{userId}": {
        "get": {
          "tags": [
            "ChargeSession"
          ],
          "parameters": [
            {
              "name": "userId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/ChargeSession/SessionHeartbeat/{sessionId}": {
        "get": {
          "tags": [
            "ChargeSession"
          ],
          "parameters": [
            {
              "name": "sessionId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Company/GetCompany/ById/{companyId}": {
        "get": {
          "tags": [
            "Company"
          ],
          "parameters": [
            {
              "name": "companyId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Company/GetAll": {
        "get": {
          "tags": [
            "Company"
          ],
          "parameters": [
            {
              "name": "Name",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "Address",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "Country",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "Page",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "Size",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Company/GetCompany/ByUser/{userId}": {
        "get": {
          "tags": [
            "Company"
          ],
          "parameters": [
            {
              "name": "userId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Company/Create": {
        "post": {
          "tags": [
            "Company"
          ],
          "requestBody": {
            "content": {
              "multipart/form-data": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "Name": {
                      "type": "string"
                    },
                    "Address": {
                      "type": "string"
                    },
                    "ContactNumber": {
                      "type": "string"
                    },
                    "Tagline": {
                      "type": "string"
                    },
                    "LogoImage": {
                      "type": "string",
                      "format": "binary"
                    },
                    "CountryId": {
                      "type": "integer",
                      "format": "int32"
                    },
                    "Email": {
                      "type": "string"
                    },
                    "Website": {
                      "type": "string"
                    },
                    "DefaultCurrency": {
                      "type": "string"
                    }
                  }
                },
                "encoding": {
                  "Name": {
                    "style": "form"
                  },
                  "Address": {
                    "style": "form"
                  },
                  "ContactNumber": {
                    "style": "form"
                  },
                  "Tagline": {
                    "style": "form"
                  },
                  "LogoImage": {
                    "style": "form"
                  },
                  "CountryId": {
                    "style": "form"
                  },
                  "Email": {
                    "style": "form"
                  },
                  "Website": {
                    "style": "form"
                  },
                  "DefaultCurrency": {
                    "style": "form"
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Company/UpdateInfo/{companyId}": {
        "put": {
          "tags": [
            "Company"
          ],
          "parameters": [
            {
              "name": "companyId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "requestBody": {
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CompanyModel"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/CompanyModel"
                }
              },
              "application/*+json": {
                "schema": {
                  "$ref": "#/components/schemas/CompanyModel"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Company/UpdateLogo/{companyId}": {
        "patch": {
          "tags": [
            "Company"
          ],
          "parameters": [
            {
              "name": "companyId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "requestBody": {
            "content": {
              "multipart/form-data": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "ContentType": {
                      "type": "string"
                    },
                    "ContentDisposition": {
                      "type": "string"
                    },
                    "Headers": {
                      "type": "object",
                      "additionalProperties": {
                        "type": "array",
                        "items": {
                          "type": "string"
                        }
                      }
                    },
                    "Length": {
                      "type": "integer",
                      "format": "int64"
                    },
                    "Name": {
                      "type": "string"
                    },
                    "FileName": {
                      "type": "string"
                    }
                  }
                },
                "encoding": {
                  "ContentType": {
                    "style": "form"
                  },
                  "ContentDisposition": {
                    "style": "form"
                  },
                  "Headers": {
                    "style": "form"
                  },
                  "Length": {
                    "style": "form"
                  },
                  "Name": {
                    "style": "form"
                  },
                  "FileName": {
                    "style": "form"
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Company/Remove/{companyId}": {
        "delete": {
          "tags": [
            "Company"
          ],
          "parameters": [
            {
              "name": "companyId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Country/GetAll": {
        "get": {
          "tags": [
            "Country"
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Country/GetCountry/{countryId}": {
        "get": {
          "tags": [
            "Country"
          ],
          "parameters": [
            {
              "name": "countryId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Dashboard/Home/{userId}": {
        "get": {
          "tags": [
            "Dashboard"
          ],
          "parameters": [
            {
              "name": "userId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Dashboard/SessionSummary/{userId}": {
        "get": {
          "tags": [
            "Dashboard"
          ],
          "parameters": [
            {
              "name": "userId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "FromDate",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "ToDate",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "ChargePointIds",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "chargerTypes",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "Page",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "Size",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Finance/GetInvoiceData/{sessionId}": {
        "get": {
          "tags": [
            "Finance"
          ],
          "parameters": [
            {
              "name": "sessionId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Finance/GetUnassingedChargers/{companyId}": {
        "get": {
          "tags": [
            "Finance"
          ],
          "parameters": [
            {
              "name": "companyId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Finance/GetBillingGroupDetails/{billingGroupId}": {
        "get": {
          "tags": [
            "Finance"
          ],
          "parameters": [
            {
              "name": "billingGroupId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Finance/CreateBillingGroup": {
        "post": {
          "tags": [
            "Finance"
          ],
          "requestBody": {
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BillingGroupModel"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/BillingGroupModel"
                }
              },
              "application/*+json": {
                "schema": {
                  "$ref": "#/components/schemas/BillingGroupModel"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Finance/EditBillingGroup/{billingGroupId}": {
        "put": {
          "tags": [
            "Finance"
          ],
          "parameters": [
            {
              "name": "billingGroupId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "requestBody": {
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BillingGroupModel"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/BillingGroupModel"
                }
              },
              "application/*+json": {
                "schema": {
                  "$ref": "#/components/schemas/BillingGroupModel"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Finance/GetBillingGroups/ByCompany/{companyId}": {
        "get": {
          "tags": [
            "Finance"
          ],
          "parameters": [
            {
              "name": "companyId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "Name",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "ChargerReference",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "WhitelistedUser",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "Page",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "Size",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Finance/DeleteBillingGroup/{billingGroupId}": {
        "delete": {
          "tags": [
            "Finance"
          ],
          "parameters": [
            {
              "name": "billingGroupId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Finance/GetBillingPayments/ByCompany/{companyId}/StatementState/{state}": {
        "get": {
          "tags": [
            "Finance"
          ],
          "parameters": [
            {
              "name": "companyId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "state",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "Year",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "Month",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "BillingGroupName",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "ChargerReference",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "Page",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "Size",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Finance/GetDueBillingStatementList/{billingGroupId}": {
        "get": {
          "tags": [
            "Finance"
          ],
          "parameters": [
            {
              "name": "billingGroupId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Finance/AddBillingPayment": {
        "post": {
          "tags": [
            "Finance"
          ],
          "requestBody": {
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BillingPayment"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/BillingPayment"
                }
              },
              "application/*+json": {
                "schema": {
                  "$ref": "#/components/schemas/BillingPayment"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Finance/GetPayableAmount/{billingStatementId}": {
        "get": {
          "tags": [
            "Finance"
          ],
          "parameters": [
            {
              "name": "billingStatementId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Finance/GetBillingStatement/{statementId}": {
        "get": {
          "tags": [
            "Finance"
          ],
          "parameters": [
            {
              "name": "statementId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Finance/IsBillingGroupExist/{billingGroupName}": {
        "get": {
          "tags": [
            "Finance"
          ],
          "parameters": [
            {
              "name": "billingGroupName",
              "in": "path",
              "required": true,
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "companyId",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Finance/GenerateMonthlyStatements": {
        "post": {
          "tags": [
            "Finance"
          ],
          "parameters": [
            {
              "name": "year",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "month",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Finance/billing-groups/{billingGroupId}/billing-statement/custom": {
        "get": {
          "tags": [
            "Finance"
          ],
          "parameters": [
            {
              "name": "billingGroupId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "fromDate",
              "in": "query",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "toDate",
              "in": "query",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Location/Create": {
        "post": {
          "tags": [
            "Location"
          ],
          "requestBody": {
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/LocationModel"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/LocationModel"
                }
              },
              "application/*+json": {
                "schema": {
                  "$ref": "#/components/schemas/LocationModel"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Location/Update/{locationId}": {
        "put": {
          "tags": [
            "Location"
          ],
          "parameters": [
            {
              "name": "locationId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "requestBody": {
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/LocationModel"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/LocationModel"
                }
              },
              "application/*+json": {
                "schema": {
                  "$ref": "#/components/schemas/LocationModel"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Location/GetLocation/ById/{locationId}": {
        "get": {
          "tags": [
            "Location"
          ],
          "parameters": [
            {
              "name": "locationId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Location/GetLocations/ByCompany/{companyId}": {
        "get": {
          "tags": [
            "Location"
          ],
          "parameters": [
            {
              "name": "companyId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "Name",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "Address",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "Company",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "Page",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "Size",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Location/GetAll": {
        "get": {
          "tags": [
            "Location"
          ],
          "parameters": [
            {
              "name": "Name",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "Address",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "Company",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "Page",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "Size",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Network/Create": {
        "post": {
          "tags": [
            "Network"
          ],
          "requestBody": {
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/NetworkModel"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/NetworkModel"
                }
              },
              "application/*+json": {
                "schema": {
                  "$ref": "#/components/schemas/NetworkModel"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Network/Update/{networkId}": {
        "put": {
          "tags": [
            "Network"
          ],
          "parameters": [
            {
              "name": "networkId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "requestBody": {
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/NetworkModel"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/NetworkModel"
                }
              },
              "application/*+json": {
                "schema": {
                  "$ref": "#/components/schemas/NetworkModel"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Network/Remove/{networkId}": {
        "delete": {
          "tags": [
            "Network"
          ],
          "parameters": [
            {
              "name": "networkId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Network/GetByCompany/{companyId}": {
        "get": {
          "tags": [
            "Network"
          ],
          "parameters": [
            {
              "name": "companyId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "Name",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "From",
              "in": "query",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "To",
              "in": "query",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "Owner",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "IsPrivate",
              "in": "query",
              "schema": {
                "type": "boolean"
              }
            },
            {
              "name": "Company",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "Page",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "Size",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Network/GetAll": {
        "get": {
          "tags": [
            "Network"
          ],
          "parameters": [
            {
              "name": "Name",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "From",
              "in": "query",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "To",
              "in": "query",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "Owner",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "IsPrivate",
              "in": "query",
              "schema": {
                "type": "boolean"
              }
            },
            {
              "name": "Company",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "Page",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "Size",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Network/AddNetworkUser": {
        "post": {
          "tags": [
            "Network"
          ],
          "requestBody": {
            "content": {
              "multipart/form-data": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "userId": {
                      "type": "integer",
                      "format": "int32"
                    },
                    "networkId": {
                      "type": "integer",
                      "format": "int32"
                    }
                  }
                },
                "encoding": {
                  "userId": {
                    "style": "form"
                  },
                  "networkId": {
                    "style": "form"
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Network/RemoveNetworkUser": {
        "delete": {
          "tags": [
            "Network"
          ],
          "requestBody": {
            "content": {
              "multipart/form-data": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "userId": {
                      "type": "integer",
                      "format": "int32"
                    },
                    "networkId": {
                      "type": "integer",
                      "format": "int32"
                    }
                  }
                },
                "encoding": {
                  "userId": {
                    "style": "form"
                  },
                  "networkId": {
                    "style": "form"
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Network/GetNetworkUsers/{networkId}": {
        "get": {
          "tags": [
            "Network"
          ],
          "parameters": [
            {
              "name": "networkId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Network/GetAssignedNetworks/{userId}": {
        "get": {
          "tags": [
            "Network"
          ],
          "parameters": [
            {
              "name": "userId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Network/GetNetwork/{networkId}": {
        "get": {
          "tags": [
            "Network"
          ],
          "parameters": [
            {
              "name": "networkId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Network/GetByOwner/{ownerId}": {
        "get": {
          "tags": [
            "Network"
          ],
          "parameters": [
            {
              "name": "ownerId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "Name",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "From",
              "in": "query",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "To",
              "in": "query",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "Owner",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "IsPrivate",
              "in": "query",
              "schema": {
                "type": "boolean"
              }
            },
            {
              "name": "Company",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "Page",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "Size",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Network/UpdateAssignedNetworks": {
        "put": {
          "tags": [
            "Network"
          ],
          "requestBody": {
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AssignedNetworkModel"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/AssignedNetworkModel"
                }
              },
              "application/*+json": {
                "schema": {
                  "$ref": "#/components/schemas/AssignedNetworkModel"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Network/IsExistNetworkName/{networkName}": {
        "get": {
          "tags": [
            "Network"
          ],
          "parameters": [
            {
              "name": "networkName",
              "in": "path",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Notification/GetNotifications/{userId}": {
        "get": {
          "tags": [
            "Notification"
          ],
          "parameters": [
            {
              "name": "userId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "index",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "limit",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Notification/NotificationMarkAsRead/{userId}": {
        "post": {
          "tags": [
            "Notification"
          ],
          "parameters": [
            {
              "name": "userId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "requestBody": {
            "content": {
              "multipart/form-data": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "notificationIdList": {
                      "type": "string"
                    }
                  }
                },
                "encoding": {
                  "notificationIdList": {
                    "style": "form"
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Notification/SendBulkNotification/{companyId}": {
        "post": {
          "tags": [
            "Notification"
          ],
          "parameters": [
            {
              "name": "companyId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "requestBody": {
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/PushNotificationModel"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/PushNotificationModel"
                }
              },
              "application/*+json": {
                "schema": {
                  "$ref": "#/components/schemas/PushNotificationModel"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Payment/GetPaymentGateway/{gatewayId}": {
        "get": {
          "tags": [
            "Payment"
          ],
          "parameters": [
            {
              "name": "gatewayId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Payment/GetAll": {
        "get": {
          "tags": [
            "Payment"
          ],
          "parameters": [
            {
              "name": "includeInactive",
              "in": "query",
              "schema": {
                "type": "boolean",
                "default": false
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Payment/GetPaymentGateway/ByCompany/{companyId}": {
        "get": {
          "tags": [
            "Payment"
          ],
          "parameters": [
            {
              "name": "companyId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Payment/GetPaymentTransaction": {
        "get": {
          "tags": [
            "Payment"
          ],
          "parameters": [
            {
              "name": "transactionId",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "transactReference",
              "in": "query",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Payment/GetPaymentTransaction/ByGatewayReference/{gatewayReference}": {
        "get": {
          "tags": [
            "Payment"
          ],
          "parameters": [
            {
              "name": "gatewayReference",
              "in": "path",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Payment/FundTransfer": {
        "post": {
          "tags": [
            "Payment"
          ],
          "requestBody": {
            "content": {
              "multipart/form-data": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "customerId": {
                      "type": "integer",
                      "format": "int32"
                    },
                    "amount": {
                      "type": "number",
                      "format": "double"
                    },
                    "remark": {
                      "type": "string"
                    }
                  }
                },
                "encoding": {
                  "customerId": {
                    "style": "form"
                  },
                  "amount": {
                    "style": "form"
                  },
                  "remark": {
                    "style": "form"
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Payment/CreatePaymentTransaction": {
        "post": {
          "tags": [
            "Payment"
          ],
          "requestBody": {
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/PaymentTransactionModel"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/PaymentTransactionModel"
                }
              },
              "application/*+json": {
                "schema": {
                  "$ref": "#/components/schemas/PaymentTransactionModel"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Payment/UpdatePaymentTransaction/{transactionId}": {
        "patch": {
          "tags": [
            "Payment"
          ],
          "parameters": [
            {
              "name": "transactionId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "requestBody": {
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/PaymentTransactionModel"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/PaymentTransactionModel"
                }
              },
              "application/*+json": {
                "schema": {
                  "$ref": "#/components/schemas/PaymentTransactionModel"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Payment/GenieCallback": {
        "post": {
          "tags": [
            "Payment"
          ],
          "requestBody": {
            "content": {
              "multipart/form-data": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "status": {
                      "type": "string"
                    },
                    "code": {
                      "type": "string"
                    },
                    "message": {
                      "type": "string"
                    },
                    "genieTxnReference": {
                      "type": "string"
                    },
                    "invoiceNumber": {
                      "type": "string"
                    },
                    "chargeTotal": {
                      "type": "string"
                    },
                    "genieTxnStatus": {
                      "type": "string"
                    },
                    "cardStatus": {
                      "type": "string"
                    },
                    "cardSaveType": {
                      "type": "string"
                    },
                    "previousInvoiceNumber": {
                      "type": "string"
                    },
                    "threeDsEnrolled": {
                      "type": "string"
                    }
                  }
                },
                "encoding": {
                  "status": {
                    "style": "form"
                  },
                  "code": {
                    "style": "form"
                  },
                  "message": {
                    "style": "form"
                  },
                  "genieTxnReference": {
                    "style": "form"
                  },
                  "invoiceNumber": {
                    "style": "form"
                  },
                  "chargeTotal": {
                    "style": "form"
                  },
                  "genieTxnStatus": {
                    "style": "form"
                  },
                  "cardStatus": {
                    "style": "form"
                  },
                  "cardSaveType": {
                    "style": "form"
                  },
                  "previousInvoiceNumber": {
                    "style": "form"
                  },
                  "threeDsEnrolled": {
                    "style": "form"
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Payment/PayHereCallback": {
        "post": {
          "tags": [
            "Payment"
          ],
          "requestBody": {
            "content": {
              "multipart/form-data": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "merchant_id": {
                      "type": "string"
                    },
                    "order_id": {
                      "type": "string"
                    },
                    "payment_id": {
                      "type": "string"
                    },
                    "payhere_amount": {
                      "type": "string"
                    },
                    "payhere_currency": {
                      "type": "string"
                    },
                    "status_code": {
                      "type": "string"
                    },
                    "md5sig": {
                      "type": "string"
                    },
                    "custom_1": {
                      "type": "string"
                    },
                    "custom_2": {
                      "type": "string"
                    },
                    "method": {
                      "type": "string"
                    },
                    "status_message": {
                      "type": "string"
                    },
                    "card_holder_name": {
                      "type": "string"
                    },
                    "card_no": {
                      "type": "string"
                    },
                    "card_expiry": {
                      "type": "string"
                    }
                  }
                },
                "encoding": {
                  "merchant_id": {
                    "style": "form"
                  },
                  "order_id": {
                    "style": "form"
                  },
                  "payment_id": {
                    "style": "form"
                  },
                  "payhere_amount": {
                    "style": "form"
                  },
                  "payhere_currency": {
                    "style": "form"
                  },
                  "status_code": {
                    "style": "form"
                  },
                  "md5sig": {
                    "style": "form"
                  },
                  "custom_1": {
                    "style": "form"
                  },
                  "custom_2": {
                    "style": "form"
                  },
                  "method": {
                    "style": "form"
                  },
                  "status_message": {
                    "style": "form"
                  },
                  "card_holder_name": {
                    "style": "form"
                  },
                  "card_no": {
                    "style": "form"
                  },
                  "card_expiry": {
                    "style": "form"
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Payment/GetPaymentTransactions": {
        "get": {
          "tags": [
            "Payment"
          ],
          "parameters": [
            {
              "name": "TransactionReference",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "GatewayReference",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "Customer",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "CreatedDateFrom",
              "in": "query",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "CreatedDateTo",
              "in": "query",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "PaymentMethod",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "Status",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "Page",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "Size",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Payment/GetPaymentTransactions/ByCustomer/{customerId}": {
        "get": {
          "tags": [
            "Payment"
          ],
          "parameters": [
            {
              "name": "customerId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "TransactionReference",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "GatewayReference",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "Customer",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "CreatedDateFrom",
              "in": "query",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "CreatedDateTo",
              "in": "query",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "PaymentMethod",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "Status",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "Page",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "Size",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Payment/GetPaymentTransactions/ByCompany/{companyId}": {
        "get": {
          "tags": [
            "Payment"
          ],
          "parameters": [
            {
              "name": "companyId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "TransactionReference",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "GatewayReference",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "Customer",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "CreatedDateFrom",
              "in": "query",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "CreatedDateTo",
              "in": "query",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "PaymentMethod",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "Status",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "Page",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "Size",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Payment/GetWalletTransactions/ByStaff/{staffId}": {
        "get": {
          "tags": [
            "Payment"
          ],
          "parameters": [
            {
              "name": "staffId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "Customer",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "Agent",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "Type",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "CreatedDateFrom",
              "in": "query",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "CreatedDateTo",
              "in": "query",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "Page",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "Size",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Payment/GetWalletTransactions/ByCustomer/{customerId}/{type}": {
        "get": {
          "tags": [
            "Payment"
          ],
          "parameters": [
            {
              "name": "customerId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "type",
              "in": "path",
              "required": true,
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "Customer",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "Agent",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "Type",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "CreatedDateFrom",
              "in": "query",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "CreatedDateTo",
              "in": "query",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "Page",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "Size",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Payment/GetWalletTransactions/{companyId}/{type}": {
        "get": {
          "tags": [
            "Payment"
          ],
          "parameters": [
            {
              "name": "companyId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "type",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "Customer",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "Agent",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "Type",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "CreatedDateFrom",
              "in": "query",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "CreatedDateTo",
              "in": "query",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "Page",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "Size",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Payment/FundTransferFromOldApp": {
        "post": {
          "tags": [
            "Payment"
          ],
          "requestBody": {
            "content": {
              "multipart/form-data": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "username": {
                      "type": "string"
                    },
                    "amount": {
                      "type": "string"
                    },
                    "remark": {
                      "type": "string"
                    },
                    "token": {
                      "type": "string"
                    }
                  }
                },
                "encoding": {
                  "username": {
                    "style": "form"
                  },
                  "amount": {
                    "style": "form"
                  },
                  "remark": {
                    "style": "form"
                  },
                  "token": {
                    "style": "form"
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Payment/users/{userId}/wallet-transactions": {
        "get": {
          "tags": [
            "Payment"
          ],
          "parameters": [
            {
              "name": "userId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Payment/ECRTransaction": {
        "post": {
          "tags": [
            "Payment"
          ],
          "requestBody": {
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ECRTransactionModel"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/ECRTransactionModel"
                }
              },
              "application/*+json": {
                "schema": {
                  "$ref": "#/components/schemas/ECRTransactionModel"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Payment/AgentFundTransfer": {
        "post": {
          "tags": [
            "Payment"
          ],
          "requestBody": {
            "content": {
              "multipart/form-data": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "rfid": {
                      "type": "string"
                    },
                    "amount": {
                      "type": "number",
                      "format": "double"
                    },
                    "transactionId": {
                      "type": "string"
                    }
                  }
                },
                "encoding": {
                  "rfid": {
                    "style": "form"
                  },
                  "amount": {
                    "style": "form"
                  },
                  "transactionId": {
                    "style": "form"
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Role/GetAll": {
        "get": {
          "tags": [
            "Role"
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Role/GetRole/{roleId}": {
        "get": {
          "tags": [
            "Role"
          ],
          "parameters": [
            {
              "name": "roleId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/TariffMode/GetTariffMode/{tariffModeId}": {
        "get": {
          "tags": [
            "TariffMode"
          ],
          "parameters": [
            {
              "name": "tariffModeId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/TariffMode/GetAll": {
        "get": {
          "tags": [
            "TariffMode"
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/TariffMode/GetTouPlan/{companyId}": {
        "get": {
          "tags": [
            "TariffMode"
          ],
          "parameters": [
            {
              "name": "companyId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/TariffMode/GetAdvancedTimePlan/{companyId}": {
        "get": {
          "tags": [
            "TariffMode"
          ],
          "parameters": [
            {
              "name": "companyId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/User/Register/{requestToken}": {
        "post": {
          "tags": [
            "User"
          ],
          "parameters": [
            {
              "name": "requestToken",
              "in": "path",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UserModel"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/UserModel"
                }
              },
              "application/*+json": {
                "schema": {
                  "$ref": "#/components/schemas/UserModel"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/User/Activate/{requestToken}": {
        "post": {
          "tags": [
            "User"
          ],
          "parameters": [
            {
              "name": "requestToken",
              "in": "path",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "content": {
              "multipart/form-data": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "username": {
                      "type": "string"
                    },
                    "pin": {
                      "type": "string"
                    }
                  }
                },
                "encoding": {
                  "username": {
                    "style": "form"
                  },
                  "pin": {
                    "style": "form"
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/User/RequestPin/{requestToken}": {
        "post": {
          "tags": [
            "User"
          ],
          "parameters": [
            {
              "name": "requestToken",
              "in": "path",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "content": {
              "multipart/form-data": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "username": {
                      "type": "string"
                    },
                    "otpNotifyingMethod": {
                      "$ref": "#/components/schemas/OtpNotifyingMethod"
                    }
                  }
                },
                "encoding": {
                  "username": {
                    "style": "form"
                  },
                  "otpNotifyingMethod": {
                    "style": "form"
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/User/Remove/{userId}": {
        "delete": {
          "tags": [
            "User"
          ],
          "parameters": [
            {
              "name": "userId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/User/GetUsers/ByCompany/{companyId}": {
        "get": {
          "tags": [
            "User"
          ],
          "parameters": [
            {
              "name": "companyId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "Name",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "Email",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "Username",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "Rfid",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "Mobile",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "Page",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "Size",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/User/GetLazyUsers/ByCompany/{companyId}/{roleId}": {
        "get": {
          "tags": [
            "User"
          ],
          "parameters": [
            {
              "name": "companyId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "roleId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "Name",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "Email",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "Username",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "Rfid",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "Mobile",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "Page",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "Size",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/User/GetUsers": {
        "get": {
          "tags": [
            "User"
          ],
          "parameters": [
            {
              "name": "Name",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "Email",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "Username",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "Rfid",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "Mobile",
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "Page",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "Size",
              "in": "query",
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/User/Create": {
        "post": {
          "tags": [
            "User"
          ],
          "requestBody": {
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UserModel"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/UserModel"
                }
              },
              "application/*+json": {
                "schema": {
                  "$ref": "#/components/schemas/UserModel"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/User/GetUser/{userId}": {
        "get": {
          "tags": [
            "User"
          ],
          "parameters": [
            {
              "name": "userId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/User/Update/{userId}": {
        "put": {
          "tags": [
            "User"
          ],
          "parameters": [
            {
              "name": "userId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "requestBody": {
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UserModel"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/UserModel"
                }
              },
              "application/*+json": {
                "schema": {
                  "$ref": "#/components/schemas/UserModel"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/User/ChangePassword/{userId}": {
        "patch": {
          "tags": [
            "User"
          ],
          "parameters": [
            {
              "name": "userId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "requestBody": {
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UserModel"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/UserModel"
                }
              },
              "application/*+json": {
                "schema": {
                  "$ref": "#/components/schemas/UserModel"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/User/GoogleRegister/{requestToken}": {
        "post": {
          "tags": [
            "User"
          ],
          "parameters": [
            {
              "name": "requestToken",
              "in": "path",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/GoogleRegisterModel"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/GoogleRegisterModel"
                }
              },
              "application/*+json": {
                "schema": {
                  "$ref": "#/components/schemas/GoogleRegisterModel"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/User/IsExistByEmail/{email}/{requestToken}": {
        "get": {
          "tags": [
            "User"
          ],
          "parameters": [
            {
              "name": "email",
              "in": "path",
              "required": true,
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "requestToken",
              "in": "path",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/User/UpdateProfilePicture/{userId}": {
        "put": {
          "tags": [
            "User"
          ],
          "parameters": [
            {
              "name": "userId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "requestBody": {
            "content": {
              "multipart/form-data": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "ContentType": {
                      "type": "string"
                    },
                    "ContentDisposition": {
                      "type": "string"
                    },
                    "Headers": {
                      "type": "object",
                      "additionalProperties": {
                        "type": "array",
                        "items": {
                          "type": "string"
                        }
                      }
                    },
                    "Length": {
                      "type": "integer",
                      "format": "int64"
                    },
                    "Name": {
                      "type": "string"
                    },
                    "FileName": {
                      "type": "string"
                    }
                  }
                },
                "encoding": {
                  "ContentType": {
                    "style": "form"
                  },
                  "ContentDisposition": {
                    "style": "form"
                  },
                  "Headers": {
                    "style": "form"
                  },
                  "Length": {
                    "style": "form"
                  },
                  "Name": {
                    "style": "form"
                  },
                  "FileName": {
                    "style": "form"
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/User/UpdateProfilePassword/{userId}": {
        "patch": {
          "tags": [
            "User"
          ],
          "parameters": [
            {
              "name": "userId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "requestBody": {
            "content": {
              "multipart/form-data": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "currentPassword": {
                      "type": "string"
                    },
                    "newPassword": {
                      "type": "string"
                    }
                  }
                },
                "encoding": {
                  "currentPassword": {
                    "style": "form"
                  },
                  "newPassword": {
                    "style": "form"
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/User/GetWallet/{userId}": {
        "get": {
          "tags": [
            "User"
          ],
          "parameters": [
            {
              "name": "userId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/User/RegisteruserDevice/{userId}": {
        "post": {
          "tags": [
            "User"
          ],
          "parameters": [
            {
              "name": "userId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "requestBody": {
            "content": {
              "multipart/form-data": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "deviceId": {
                      "type": "string"
                    },
                    "deviceType": {
                      "type": "string"
                    }
                  }
                },
                "encoding": {
                  "deviceId": {
                    "style": "form"
                  },
                  "deviceType": {
                    "style": "form"
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/User/BasicUserDetails/ByCompany/{companyId}/{roleId}": {
        "get": {
          "tags": [
            "User"
          ],
          "parameters": [
            {
              "name": "companyId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "roleId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Vehicle/All": {
        "get": {
          "tags": [
            "Vehicle"
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Vehicle/User/{userId}/{vehicleId}": {
        "post": {
          "tags": [
            "Vehicle"
          ],
          "parameters": [
            {
              "name": "userId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "vehicleId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "requestBody": {
            "content": {
              "multipart/form-data": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "comment": {
                      "type": "string"
                    }
                  }
                },
                "encoding": {
                  "comment": {
                    "style": "form"
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        },
        "delete": {
          "tags": [
            "Vehicle"
          ],
          "parameters": [
            {
              "name": "userId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            },
            {
              "name": "vehicleId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      },
      "/api/Vehicle/User/{userId}": {
        "get": {
          "tags": [
            "Vehicle"
          ],
          "parameters": [
            {
              "name": "userId",
              "in": "path",
              "required": true,
              "schema": {
                "type": "integer",
                "format": "int32"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            }
          }
        }
      }
    },
    "components": {
      "schemas": {
        "AppleLoginModel": {
          "type": "object",
          "properties": {
            "appleEmail": {
              "type": "string",
              "nullable": true
            },
            "appleId": {
              "type": "string",
              "nullable": true
            },
            "firstName": {
              "type": "string",
              "nullable": true
            },
            "lastName": {
              "type": "string",
              "nullable": true
            },
            "userId": {
              "type": "integer",
              "format": "int32",
              "nullable": true
            },
            "personalEmail": {
              "type": "string",
              "nullable": true
            },
            "contactNo": {
              "type": "string",
              "nullable": true
            },
            "companyId": {
              "type": "integer",
              "format": "int32",
              "nullable": true
            },
            "loginMode": {
              "type": "string",
              "nullable": true
            }
          },
          "additionalProperties": false
        },
        "AssignedNetworkModel": {
          "type": "object",
          "properties": {
            "userId": {
              "type": "integer",
              "format": "int32"
            },
            "ownerId": {
              "type": "integer",
              "format": "int32"
            },
            "assignedNetworks": {
              "type": "array",
              "items": {
                "type": "integer",
                "format": "int32"
              },
              "nullable": true
            }
          },
          "additionalProperties": false
        },
        "BgCharger": {
          "type": "object",
          "properties": {
            "id": {
              "type": "integer",
              "format": "int32"
            },
            "reference": {
              "type": "string",
              "nullable": true
            },
            "isChecked": {
              "type": "boolean"
            }
          },
          "additionalProperties": false
        },
        "BgUser": {
          "type": "object",
          "properties": {
            "id": {
              "type": "integer",
              "format": "int32"
            },
            "name": {
              "type": "string",
              "nullable": true
            },
            "rfid": {
              "type": "string",
              "nullable": true
            }
          },
          "additionalProperties": false
        },
        "BillingGroup": {
          "type": "object",
          "properties": {
            "idBillingGroup": {
              "type": "integer",
              "format": "int32"
            },
            "name": {
              "type": "string",
              "nullable": true
            },
            "address": {
              "type": "string",
              "nullable": true
            },
            "email": {
              "type": "string",
              "nullable": true
            },
            "companyId": {
              "type": "integer",
              "format": "int32"
            },
            "tariffType": {
              "type": "integer",
              "format": "int32"
            },
            "serviceChargePrecentage": {
              "type": "number",
              "format": "double"
            },
            "createdTimestamp": {
              "type": "string",
              "format": "date-time"
            },
            "billingGroupFee": {
              "$ref": "#/components/schemas/BillingGroupFee"
            },
            "listChargers": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/BgCharger"
              },
              "nullable": true
            },
            "listWhitelistedUsers": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/BgUser"
              },
              "nullable": true
            }
          },
          "additionalProperties": false
        },
        "BillingGroupFee": {
          "type": "object",
          "properties": {
            "idBillingGroupFee": {
              "type": "integer",
              "format": "int32"
            },
            "idBillingGroup": {
              "type": "integer",
              "format": "int32"
            },
            "profitSharePercentage": {
              "type": "number",
              "format": "double",
              "nullable": true
            },
            "energyUnitCost": {
              "type": "number",
              "format": "double",
              "nullable": true
            },
            "peakEnergyCharge": {
              "type": "number",
              "format": "double",
              "nullable": true
            },
            "offpeakEnergyCharge": {
              "type": "number",
              "format": "double",
              "nullable": true
            },
            "dayEnergyCharge": {
              "type": "number",
              "format": "double",
              "nullable": true
            },
            "fixedCharge": {
              "type": "number",
              "format": "double",
              "nullable": true
            },
            "updatedTimestamp": {
              "type": "string",
              "format": "date-time"
            }
          },
          "additionalProperties": false
        },
        "BillingGroupModel": {
          "type": "object",
          "properties": {
            "billingGroup": {
              "$ref": "#/components/schemas/BillingGroup"
            },
            "billingGroupFee": {
              "$ref": "#/components/schemas/BillingGroupFee"
            },
            "chargePoints": {
              "type": "array",
              "items": {
                "type": "integer",
                "format": "int32"
              },
              "nullable": true
            },
            "whitelistedUsers": {
              "type": "array",
              "items": {
                "type": "integer",
                "format": "int32"
              },
              "nullable": true
            }
          },
          "additionalProperties": false
        },
        "BillingPayment": {
          "type": "object",
          "properties": {
            "idBillingPayment": {
              "type": "integer",
              "format": "int32"
            },
            "idBillingStatement": {
              "type": "integer",
              "format": "int32"
            },
            "dateOfPayment": {
              "type": "string",
              "format": "date-time"
            },
            "typeOfPayment": {
              "type": "string",
              "nullable": true
            },
            "chequeNo": {
              "type": "string",
              "nullable": true
            },
            "timestamp": {
              "type": "string",
              "format": "date-time"
            }
          },
          "additionalProperties": false
        },
        "ChargeNetwork": {
          "type": "object",
          "properties": {
            "id": {
              "type": "integer",
              "format": "int32",
              "nullable": true
            },
            "networkName": {
              "type": "string",
              "nullable": true
            },
            "isDeleted": {
              "type": "boolean"
            },
            "isPrivate": {
              "type": "boolean"
            },
            "createdDate": {
              "type": "string",
              "format": "date-time",
              "nullable": true
            },
            "company": {
              "$ref": "#/components/schemas/Company"
            },
            "owner": {
              "$ref": "#/components/schemas/User"
            }
          },
          "additionalProperties": false
        },
        "ChargePoint": {
          "type": "object",
          "properties": {
            "id": {
              "type": "integer",
              "format": "int32",
              "nullable": true
            },
            "reference": {
              "type": "string",
              "nullable": true
            },
            "chargeNetwork": {
              "$ref": "#/components/schemas/ChargeNetwork"
            },
            "chargerLocation": {
              "$ref": "#/components/schemas/ChargerLocation"
            },
            "chargerType": {
              "$ref": "#/components/schemas/ChargerType"
            },
            "imageUrl": {
              "type": "string",
              "nullable": true
            },
            "tariffMode": {
              "$ref": "#/components/schemas/TariffMode"
            },
            "isShown": {
              "type": "boolean",
              "nullable": true
            },
            "evseModules": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/ChargerEVSE"
              },
              "nullable": true
            },
            "minimumBalance": {
              "type": "number",
              "format": "double",
              "nullable": true
            },
            "unitCostOutside": {
              "type": "number",
              "format": "double",
              "nullable": true
            },
            "unitCostInNetwork": {
              "type": "number",
              "format": "double",
              "nullable": true
            },
            "unitCostOutNetwork": {
              "type": "number",
              "format": "double",
              "nullable": true
            },
            "isActive": {
              "type": "boolean",
              "nullable": true
            },
            "createdDate": {
              "type": "string",
              "format": "date-time",
              "nullable": true
            },
            "isSupportOCPP": {
              "type": "boolean",
              "nullable": true
            },
            "isDeleted": {
              "type": "boolean",
              "nullable": true
            },
            "allowPublicCharging": {
              "type": "boolean",
              "nullable": true
            },
            "password": {
              "type": "string",
              "nullable": true
            },
            "tariffRates": {
              "$ref": "#/components/schemas/TariffRates"
            },
            "description": {
              "type": "string",
              "nullable": true
            },
            "tags": {
              "type": "string",
              "nullable": true
            },
            "rateScore": {
              "type": "number",
              "format": "double"
            },
            "numberOfRatings": {
              "type": "integer",
              "format": "int32"
            },
            "isDualPort": {
              "type": "boolean",
              "nullable": true
            },
            "rate": {
              "type": "number",
              "format": "double",
              "nullable": true,
              "readOnly": true
            }
          },
          "additionalProperties": false
        },
        "ChargeSession": {
          "type": "object",
          "properties": {
            "id": {
              "type": "integer",
              "format": "int32",
              "nullable": true
            },
            "sessionId": {
              "type": "string",
              "nullable": true
            },
            "charger": {
              "$ref": "#/components/schemas/ChargePoint"
            },
            "startTime": {
              "type": "string",
              "format": "date-time",
              "nullable": true
            },
            "endTime": {
              "type": "string",
              "format": "date-time",
              "nullable": true
            },
            "totalAmount": {
              "type": "number",
              "format": "double",
              "nullable": true
            },
            "tariffRevision": {
              "type": "string",
              "nullable": true
            },
            "status": {
              "type": "string",
              "nullable": true
            },
            "evse": {
              "$ref": "#/components/schemas/ChargerEVSE"
            },
            "connector": {
              "$ref": "#/components/schemas/EVSEConnector"
            },
            "user": {
              "$ref": "#/components/schemas/User"
            },
            "duration": {
              "$ref": "#/components/schemas/TimeSpan"
            },
            "energyConsumption": {
              "type": "number",
              "format": "double",
              "nullable": true
            },
            "stopReason": {
              "type": "string",
              "nullable": true
            },
            "stopReasonId": {
              "type": "integer",
              "format": "int32"
            },
            "isDelete": {
              "type": "boolean"
            }
          },
          "additionalProperties": false
        },
        "ChargeSessionEndModel": {
          "type": "object",
          "properties": {
            "userId": {
              "type": "integer",
              "format": "int32",
              "nullable": true
            },
            "rfid": {
              "type": "string",
              "nullable": true
            },
            "username": {
              "type": "string",
              "nullable": true
            },
            "sessionId": {
              "type": "string",
              "nullable": true
            },
            "chargerReference": {
              "type": "string",
              "nullable": true
            },
            "evsePortId": {
              "type": "integer",
              "format": "int32"
            },
            "connectorPortId": {
              "type": "integer",
              "format": "int32"
            },
            "sessionSummary": {
              "nullable": true
            },
            "stopReason": {
              "type": "integer",
              "format": "int32"
            }
          },
          "additionalProperties": false
        },
        "ChargeSessionStartModel": {
          "type": "object",
          "properties": {
            "userId": {
              "type": "integer",
              "format": "int32",
              "nullable": true
            },
            "rfid": {
              "type": "string",
              "nullable": true
            },
            "username": {
              "type": "string",
              "nullable": true
            },
            "sessionId": {
              "type": "string",
              "nullable": true
            },
            "chargerReference": {
              "type": "string",
              "nullable": true
            },
            "evsePortId": {
              "type": "integer",
              "format": "int32"
            },
            "connectorPortId": {
              "type": "integer",
              "format": "int32"
            }
          },
          "additionalProperties": false
        },
        "ChargerEVSE": {
          "type": "object",
          "properties": {
            "id": {
              "type": "integer",
              "format": "int32",
              "nullable": true
            },
            "reference": {
              "type": "string",
              "nullable": true
            },
            "portId": {
              "type": "integer",
              "format": "int32",
              "nullable": true
            },
            "evseConnectors": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/EVSEConnector"
              },
              "nullable": true
            },
            "isDeleted": {
              "type": "boolean"
            },
            "chargePointId": {
              "type": "integer",
              "format": "int32"
            }
          },
          "additionalProperties": false
        },
        "ChargerLocation": {
          "type": "object",
          "properties": {
            "id": {
              "type": "integer",
              "format": "int32",
              "nullable": true
            },
            "name": {
              "type": "string",
              "nullable": true
            },
            "longitude": {
              "type": "number",
              "format": "double"
            },
            "latitude": {
              "type": "number",
              "format": "double"
            },
            "address": {
              "type": "string",
              "nullable": true
            },
            "isDeleted": {
              "type": "boolean"
            },
            "company": {
              "$ref": "#/components/schemas/Company"
            }
          },
          "additionalProperties": false
        },
        "ChargerType": {
          "type": "object",
          "properties": {
            "id": {
              "type": "integer",
              "format": "int32",
              "nullable": true
            },
            "name": {
              "type": "string",
              "nullable": true
            }
          },
          "additionalProperties": false
        },
        "Company": {
          "type": "object",
          "properties": {
            "id": {
              "type": "integer",
              "format": "int32",
              "nullable": true
            },
            "name": {
              "type": "string",
              "nullable": true
            },
            "address": {
              "type": "string",
              "nullable": true
            },
            "contactNumber": {
              "type": "string",
              "nullable": true
            },
            "logoImage": {
              "type": "string",
              "nullable": true
            },
            "email": {
              "type": "string",
              "nullable": true
            },
            "website": {
              "type": "string",
              "nullable": true
            },
            "logoImageId": {
              "type": "string",
              "nullable": true
            },
            "tagLine": {
              "type": "string",
              "nullable": true
            },
            "isDeleted": {
              "type": "boolean"
            },
            "country": {
              "$ref": "#/components/schemas/Country"
            },
            "defaultCurrency": {
              "type": "string",
              "nullable": true
            },
            "invoiceType": {
              "type": "string",
              "nullable": true
            },
            "timeZoneInfo": {
              "$ref": "#/components/schemas/RegionTimeZoneInfo"
            },
            "dateTimeFormat": {
              "type": "string",
              "nullable": true
            }
          },
          "additionalProperties": false
        },
        "CompanyModel": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "nullable": true
            },
            "address": {
              "type": "string",
              "nullable": true
            },
            "contactNumber": {
              "type": "string",
              "nullable": true
            },
            "tagline": {
              "type": "string",
              "nullable": true
            },
            "logoImage": {
              "type": "string",
              "format": "binary",
              "nullable": true
            },
            "countryId": {
              "type": "integer",
              "format": "int32",
              "nullable": true
            },
            "email": {
              "type": "string",
              "nullable": true
            },
            "website": {
              "type": "string",
              "nullable": true
            },
            "defaultCurrency": {
              "type": "string",
              "nullable": true
            }
          },
          "additionalProperties": false
        },
        "ConnectorModel": {
          "type": "object",
          "properties": {
            "portId": {
              "type": "integer",
              "format": "int32",
              "nullable": true
            },
            "reference": {
              "type": "string",
              "nullable": true
            },
            "connectorTypeId": {
              "type": "integer",
              "format": "int32",
              "nullable": true
            },
            "evseId": {
              "type": "integer",
              "format": "int32",
              "nullable": true
            },
            "status": {
              "type": "integer",
              "format": "int32"
            }
          },
          "additionalProperties": false
        },
        "ConnectorStatus": {
          "enum": [
            1,
            2,
            3
          ],
          "type": "integer",
          "format": "int32"
        },
        "ConnectorType": {
          "type": "object",
          "properties": {
            "id": {
              "type": "integer",
              "format": "int32",
              "nullable": true
            },
            "name": {
              "type": "string",
              "nullable": true
            }
          },
          "additionalProperties": false
        },
        "Country": {
          "type": "object",
          "properties": {
            "id": {
              "type": "integer",
              "format": "int32",
              "nullable": true
            },
            "name": {
              "type": "string",
              "nullable": true
            },
            "isDeleted": {
              "type": "boolean"
            }
          },
          "additionalProperties": false
        },
        "ECRTransactionModel": {
          "type": "object",
          "properties": {
            "referenceNo": {
              "type": "string",
              "nullable": true
            },
            "invoiceNo": {
              "type": "string",
              "nullable": true
            },
            "transactionId": {
              "type": "string",
              "nullable": true
            },
            "userId": {
              "type": "integer",
              "format": "int32"
            },
            "holdAmount": {
              "type": "string",
              "nullable": true
            },
            "actualAmount": {
              "type": "string",
              "nullable": true
            },
            "state": {
              "type": "string",
              "nullable": true
            }
          },
          "additionalProperties": false
        },
        "EVSEConnector": {
          "type": "object",
          "properties": {
            "id": {
              "type": "integer",
              "format": "int32",
              "nullable": true
            },
            "portId": {
              "type": "integer",
              "format": "int32",
              "nullable": true
            },
            "reference": {
              "type": "string",
              "nullable": true
            },
            "connectorType": {
              "$ref": "#/components/schemas/ConnectorType"
            },
            "isDeleted": {
              "type": "boolean"
            },
            "evseId": {
              "type": "integer",
              "format": "int32",
              "nullable": true
            },
            "status": {
              "$ref": "#/components/schemas/ConnectorStatus"
            }
          },
          "additionalProperties": false
        },
        "ExternalLoginModel": {
          "type": "object",
          "properties": {
            "email": {
              "type": "string",
              "nullable": true
            },
            "loginMode": {
              "type": "string",
              "nullable": true
            }
          },
          "additionalProperties": false
        },
        "GoogleRegisterModel": {
          "type": "object",
          "properties": {
            "firstName": {
              "type": "string",
              "nullable": true
            },
            "lastName": {
              "type": "string",
              "nullable": true
            },
            "email": {
              "type": "string",
              "nullable": true
            },
            "contactNumber": {
              "type": "string",
              "nullable": true
            },
            "companyId": {
              "type": "integer",
              "format": "int32",
              "nullable": true
            },
            "countryId": {
              "type": "integer",
              "format": "int32",
              "nullable": true
            },
            "loginMode": {
              "type": "string",
              "nullable": true
            }
          },
          "additionalProperties": false
        },
        "IdentityUser": {
          "type": "object",
          "properties": {
            "id": {
              "type": "integer",
              "format": "int32"
            },
            "username": {
              "type": "string",
              "nullable": true
            },
            "role": {
              "type": "string",
              "nullable": true
            },
            "companyId": {
              "type": "integer",
              "format": "int32",
              "nullable": true
            },
            "accessToken": {
              "type": "string",
              "nullable": true
            },
            "refreshToken": {
              "type": "string",
              "nullable": true
            },
            "createdOn": {
              "type": "string",
              "format": "date-time",
              "nullable": true
            },
            "expiresOn": {
              "type": "string",
              "format": "date-time",
              "nullable": true
            }
          },
          "additionalProperties": false
        },
        "LocationModel": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "nullable": true
            },
            "longitude": {
              "type": "number",
              "format": "double"
            },
            "latitude": {
              "type": "number",
              "format": "double"
            },
            "address": {
              "type": "string",
              "nullable": true
            },
            "companyId": {
              "type": "integer",
              "format": "int32"
            }
          },
          "additionalProperties": false
        },
        "LoginModel": {
          "type": "object",
          "properties": {
            "userId": {
              "type": "integer",
              "format": "int32"
            },
            "username": {
              "type": "string",
              "nullable": true
            },
            "password": {
              "type": "string",
              "nullable": true
            },
            "passwordHash": {
              "type": "string",
              "nullable": true
            },
            "loginMode": {
              "type": "string",
              "nullable": true
            },
            "accessToken": {
              "type": "string",
              "nullable": true
            }
          },
          "additionalProperties": false
        },
        "NetworkModel": {
          "type": "object",
          "properties": {
            "networkName": {
              "type": "string",
              "nullable": true
            },
            "isPrivate": {
              "type": "boolean"
            },
            "createdDate": {
              "type": "string",
              "format": "date-time"
            },
            "companyId": {
              "type": "integer",
              "format": "int32"
            },
            "ownerId": {
              "type": "integer",
              "format": "int32"
            }
          },
          "additionalProperties": false
        },
        "OtpNotifyingMethod": {
          "enum": [
            0,
            1,
            2
          ],
          "type": "integer",
          "format": "int32"
        },
        "PaymentStatus": {
          "enum": [
            0,
            1,
            2,
            3,
            4,
            5
          ],
          "type": "integer",
          "format": "int32"
        },
        "PaymentTransactionModel": {
          "type": "object",
          "properties": {
            "gatewayId": {
              "type": "integer",
              "format": "int32",
              "nullable": true
            },
            "transactionReference": {
              "type": "string",
              "nullable": true
            },
            "gatewayReference": {
              "type": "string",
              "nullable": true
            },
            "effectiveAmount": {
              "type": "string",
              "nullable": true
            },
            "totalAmount": {
              "type": "string",
              "nullable": true
            },
            "customerId": {
              "type": "integer",
              "format": "int32",
              "nullable": true
            },
            "status": {
              "$ref": "#/components/schemas/PaymentStatus"
            },
            "currency": {
              "type": "string",
              "nullable": true
            },
            "paymentMethod": {
              "type": "string",
              "nullable": true
            },
            "signature": {
              "type": "string",
              "nullable": true
            }
          },
          "additionalProperties": false
        },
        "PushNotificationModel": {
          "type": "object",
          "properties": {
            "deviceId": {
              "type": "string",
              "nullable": true
            },
            "userId": {
              "type": "integer",
              "format": "int32"
            },
            "deviceAddress": {
              "type": "string",
              "nullable": true
            },
            "deviceType": {
              "type": "string",
              "nullable": true
            },
            "title": {
              "type": "string",
              "nullable": true
            },
            "body": {
              "type": "string",
              "nullable": true
            }
          },
          "additionalProperties": false
        },
        "RecoveryAction": {
          "enum": [
            0,
            1,
            2,
            3
          ],
          "type": "integer",
          "format": "int32"
        },
        "RecoveryModel": {
          "type": "object",
          "properties": {
            "recoveryAction": {
              "$ref": "#/components/schemas/RecoveryAction"
            },
            "username": {
              "type": "string",
              "nullable": true
            },
            "pin": {
              "type": "string",
              "nullable": true
            },
            "password": {
              "type": "string",
              "nullable": true
            }
          },
          "additionalProperties": false
        },
        "RegionTimeZoneInfo": {
          "type": "object",
          "properties": {
            "id": {
              "type": "integer",
              "format": "int32",
              "nullable": true
            },
            "timeZoneId": {
              "type": "string",
              "nullable": true
            },
            "displayName": {
              "type": "string",
              "nullable": true
            },
            "utcOffset": {
              "$ref": "#/components/schemas/TimeSpan"
            },
            "isSupportDayLightSaving": {
              "type": "boolean"
            }
          },
          "additionalProperties": false
        },
        "Role": {
          "type": "object",
          "properties": {
            "id": {
              "type": "integer",
              "format": "int32"
            },
            "name": {
              "type": "string",
              "nullable": true
            },
            "isDeleted": {
              "type": "boolean"
            },
            "accessLevel": {
              "type": "integer",
              "format": "int32",
              "nullable": true
            }
          },
          "additionalProperties": false
        },
        "TariffMode": {
          "type": "object",
          "properties": {
            "id": {
              "type": "integer",
              "format": "int32",
              "nullable": true
            },
            "name": {
              "type": "string",
              "nullable": true
            }
          },
          "additionalProperties": false
        },
        "TariffRates": {
          "type": "object",
          "properties": {
            "tariffRevision": {
              "type": "string",
              "nullable": true
            },
            "revisionDate": {
              "type": "string",
              "format": "date-time"
            }
          },
          "additionalProperties": false
        },
        "TimeSpan": {
          "type": "object",
          "properties": {
            "ticks": {
              "type": "integer",
              "format": "int64",
              "readOnly": true
            },
            "days": {
              "type": "integer",
              "format": "int32",
              "readOnly": true
            },
            "hours": {
              "type": "integer",
              "format": "int32",
              "readOnly": true
            },
            "milliseconds": {
              "type": "integer",
              "format": "int32",
              "readOnly": true
            },
            "minutes": {
              "type": "integer",
              "format": "int32",
              "readOnly": true
            },
            "seconds": {
              "type": "integer",
              "format": "int32",
              "readOnly": true
            },
            "totalDays": {
              "type": "number",
              "format": "double",
              "readOnly": true
            },
            "totalHours": {
              "type": "number",
              "format": "double",
              "readOnly": true
            },
            "totalMilliseconds": {
              "type": "number",
              "format": "double",
              "readOnly": true
            },
            "totalMinutes": {
              "type": "number",
              "format": "double",
              "readOnly": true
            },
            "totalSeconds": {
              "type": "number",
              "format": "double",
              "readOnly": true
            }
          },
          "additionalProperties": false
        },
        "User": {
          "type": "object",
          "properties": {
            "id": {
              "type": "integer",
              "format": "int32"
            },
            "firstName": {
              "type": "string",
              "nullable": true
            },
            "lastName": {
              "type": "string",
              "nullable": true
            },
            "createdDate": {
              "type": "string",
              "format": "date-time"
            },
            "email": {
              "type": "string",
              "nullable": true
            },
            "contactNumber": {
              "type": "string",
              "nullable": true
            },
            "country": {
              "$ref": "#/components/schemas/Country"
            },
            "isActive": {
              "type": "boolean"
            },
            "isTest": {
              "type": "boolean"
            },
            "username": {
              "type": "string",
              "nullable": true
            },
            "password": {
              "type": "string",
              "nullable": true
            },
            "salt": {
              "type": "string",
              "nullable": true
            },
            "role": {
              "$ref": "#/components/schemas/Role"
            },
            "activationPin": {
              "type": "string",
              "nullable": true
            },
            "rfid": {
              "type": "string",
              "nullable": true
            },
            "company": {
              "$ref": "#/components/schemas/Company"
            },
            "isDeleted": {
              "type": "boolean"
            },
            "requirePasswordResetAtLogin": {
              "type": "boolean",
              "nullable": true
            },
            "profilePicture": {
              "type": "string",
              "nullable": true
            },
            "profilePictureId": {
              "type": "string",
              "nullable": true
            }
          },
          "additionalProperties": false
        },
        "UserAuthModel": {
          "type": "object",
          "properties": {
            "userId": {
              "type": "integer",
              "format": "int32",
              "nullable": true
            },
            "rfid": {
              "type": "string",
              "nullable": true
            },
            "username": {
              "type": "string",
              "nullable": true
            }
          },
          "additionalProperties": false
        },
        "UserModel": {
          "type": "object",
          "properties": {
            "id": {
              "type": "integer",
              "format": "int32"
            },
            "token": {
              "type": "string",
              "nullable": true
            },
            "firstName": {
              "type": "string",
              "nullable": true
            },
            "lastName": {
              "type": "string",
              "nullable": true
            },
            "email": {
              "type": "string",
              "nullable": true
            },
            "contactNumber": {
              "type": "string",
              "nullable": true
            },
            "countryId": {
              "type": "integer",
              "format": "int32"
            },
            "username": {
              "type": "string",
              "nullable": true
            },
            "password": {
              "type": "string",
              "nullable": true
            },
            "roleId": {
              "type": "integer",
              "format": "int32"
            },
            "rfid": {
              "type": "string",
              "nullable": true
            },
            "companyId": {
              "type": "integer",
              "format": "int32",
              "nullable": true
            },
            "otpNotifyingMethod": {
              "$ref": "#/components/schemas/OtpNotifyingMethod"
            },
            "requirePasswordResetAtLogin": {
              "type": "boolean"
            },
            "fromMobileApp": {
              "type": "boolean"
            }
          },
          "additionalProperties": false
        }
      },
      "securitySchemes": {
        "Access-Token": {
          "type": "http",
          "description": "Login Access-Token (JWT) provoded by ChargeNET authentication system",
          "scheme": "bearer",
          "bearerFormat": "JWT"
        }
      }
    },
    "security": [
      {
        "Access-Token": []
      }
    ]
  }
};

// Universal MCP Server that can work with any Swagger specification
export class MyMCP extends McpAgent {
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
      return MyMCP.serveSSE("/sse").fetch(request, env, ctx);
    }

    if (url.pathname === "/mcp") {
      return MyMCP.serve("/mcp").fetch(request, env, ctx);
    }

    return new Response("Not found", { status: 404 });
  },
};