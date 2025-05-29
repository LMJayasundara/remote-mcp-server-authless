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

// Define author interface
interface Author {
	id: number;
	idBook: number;
	firstName: string;
	lastName: string;
}

// Define book interface
interface Book {
	id: number;
	title: string;
	description: string;
	pageCount: number;
	excerpt: string;
	publishDate: string;
}

// Define cover photo interface
interface CoverPhoto {
	id: number;
	idBook: number;
	url: string;
}

// Define user interface
interface User {
	id: number;
	userName: string;
	password: string;
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
								// Activities Tools
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
									name: "update_activity",
									description: "Update an existing activity by ID",
									parameters: {
										id: "number - ID of the activity to update",
										title: "string - Activity title (optional)",
										dueDate: "string - Due date in ISO format (optional)",
										completed: "boolean - Whether the activity is completed (optional)"
									}
								},
								{
									name: "delete_activity",
									description: "Delete an activity by ID",
									parameters: {
										id: "number - ID of the activity to delete"
									}
								},
								// Authors Tools
								{
									name: "get_authors",
									description: "Get all authors from the API"
								},
								{
									name: "create_author",
									description: "Create a new author",
									parameters: {
										id: "number - Author ID",
										idBook: "number - Book ID this author is associated with",
										firstName: "string - Author's first name",
										lastName: "string - Author's last name"
									}
								},
								{
									name: "get_author_by_id",
									description: "Get details of a specific author by ID",
									parameters: {
										id: "number - ID of the author to retrieve"
									}
								},
								{
									name: "get_authors_by_book_id",
									description: "Get all authors for a specific book",
									parameters: {
										idBook: "number - ID of the book to get authors for"
									}
								},
								{
									name: "update_author",
									description: "Update an existing author by ID",
									parameters: {
										id: "number - ID of the author to update",
										idBook: "number - Book ID (optional)",
										firstName: "string - Author's first name (optional)",
										lastName: "string - Author's last name (optional)"
									}
								},
								{
									name: "delete_author",
									description: "Delete an author by ID",
									parameters: {
										id: "number - ID of the author to delete"
									}
								},
								// Books Tools
								{
									name: "get_books",
									description: "Get all books from the API"
								},
								{
									name: "create_book",
									description: "Create a new book",
									parameters: {
										id: "number - Book ID",
										title: "string - Book title",
										description: "string - Book description",
										pageCount: "number - Number of pages",
										excerpt: "string - Book excerpt",
										publishDate: "string - Publish date in ISO format"
									}
								},
								{
									name: "get_book_by_id",
									description: "Get details of a specific book by ID",
									parameters: {
										id: "number - ID of the book to retrieve"
									}
								},
								{
									name: "update_book",
									description: "Update an existing book by ID",
									parameters: {
										id: "number - ID of the book to update",
										title: "string - Book title (optional)",
										description: "string - Book description (optional)",
										pageCount: "number - Number of pages (optional)",
										excerpt: "string - Book excerpt (optional)",
										publishDate: "string - Publish date in ISO format (optional)"
									}
								},
								{
									name: "delete_book",
									description: "Delete a book by ID",
									parameters: {
										id: "number - ID of the book to delete"
									}
								},
								// Cover Photos Tools
								{
									name: "get_cover_photos",
									description: "Get all cover photos from the API"
								},
								{
									name: "create_cover_photo",
									description: "Create a new cover photo",
									parameters: {
										id: "number - Cover photo ID",
										idBook: "number - Book ID this cover is for",
										url: "string - URL of the cover photo"
									}
								},
								{
									name: "get_cover_photo_by_id",
									description: "Get details of a specific cover photo by ID",
									parameters: {
										id: "number - ID of the cover photo to retrieve"
									}
								},
								{
									name: "get_cover_photos_by_book_id",
									description: "Get all cover photos for a specific book",
									parameters: {
										idBook: "number - ID of the book to get cover photos for"
									}
								},
								{
									name: "update_cover_photo",
									description: "Update an existing cover photo by ID",
									parameters: {
										id: "number - ID of the cover photo to update",
										idBook: "number - Book ID (optional)",
										url: "string - URL of the cover photo (optional)"
									}
								},
								{
									name: "delete_cover_photo",
									description: "Delete a cover photo by ID",
									parameters: {
										id: "number - ID of the cover photo to delete"
									}
								},
								// Users Tools
								{
									name: "get_users",
									description: "Get all users from the API"
								},
								{
									name: "create_user",
									description: "Create a new user",
									parameters: {
										id: "number - User ID",
										userName: "string - Username",
										password: "string - User password"
									}
								},
								{
									name: "get_user_by_id",
									description: "Get details of a specific user by ID",
									parameters: {
										id: "number - ID of the user to retrieve"
									}
								},
								{
									name: "update_user",
									description: "Update an existing user by ID",
									parameters: {
										id: "number - ID of the user to update",
										userName: "string - Username (optional)",
										password: "string - User password (optional)"
									}
								},
								{
									name: "delete_user",
									description: "Delete a user by ID",
									parameters: {
										id: "number - ID of the user to delete"
									}
								},
								// System Tools
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

		// Update activity by ID
		this.server.tool(
			"update_activity",
			{
				id: z.number(),
				title: z.string().optional(),
				dueDate: z.string().optional(),
				completed: z.boolean().optional()
			},
			async ({ id, title, dueDate, completed }) => {
				try {
					const updateData: Partial<Activity> = {};
					if (title !== undefined) updateData.title = title;
					if (dueDate !== undefined) updateData.dueDate = dueDate;
					if (completed !== undefined) updateData.completed = completed;

					const response = await fetch(`${this.API_BASE_URL}/api/v1/Activities/${id}`, {
						method: 'PUT',
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({ id, ...updateData })
					});

					if (!response.ok) {
						throw new Error(`HTTP error! status: ${response.status}`);
					}

					const updatedActivity = await response.json() as Activity;
					
					return {
						content: [
							{
								type: "text",
								text: `Successfully updated activity:\n\n${JSON.stringify(updatedActivity, null, 2)}`
							}
						]
					};
				} catch (error: unknown) {
					const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
					return {
						content: [
							{
								type: "text",
								text: `Error updating activity: ${errorMessage}`
							}
						]
					};
				}
			}
		);

		// Delete activity by ID
		this.server.tool(
			"delete_activity",
			{ id: z.number() },
			async ({ id }) => {
				try {
					const response = await fetch(`${this.API_BASE_URL}/api/v1/Activities/${id}`, {
						method: 'DELETE',
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json'
						}
					});

					if (!response.ok) {
						throw new Error(`HTTP error! status: ${response.status}`);
					}
					
					return {
						content: [
							{
								type: "text",
								text: `Successfully deleted activity with ID ${id}`
							}
						]
					};
				} catch (error: unknown) {
					const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
					return {
						content: [
							{
								type: "text",
								text: `Error deleting activity: ${errorMessage}`
							}
						]
					};
				}
			}
		);

		// AUTHORS TOOLS

		// Get all authors
		this.server.tool(
			"get_authors",
			{},
			async () => {
				try {
					const response = await fetch(`${this.API_BASE_URL}/api/v1/Authors`, {
						method: 'GET',
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json'
						}
					});

					if (!response.ok) {
						throw new Error(`HTTP error! status: ${response.status}`);
					}

					const authors = await response.json() as Author[];
					
					return {
						content: [
							{
								type: "text",
								text: `Found ${authors.length} authors:\n\n${JSON.stringify(authors, null, 2)}`
							}
						]
					};
				} catch (error: unknown) {
					const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
					return {
						content: [
							{
								type: "text",
								text: `Error fetching authors: ${errorMessage}`
							}
						]
					};
				}
			}
		);

		// Create a new author
		this.server.tool(
			"create_author",
			{
				id: z.number(),
				idBook: z.number(),
				firstName: z.string(),
				lastName: z.string()
			},
			async ({ id, idBook, firstName, lastName }) => {
				try {
					const authorData = {
						id,
						idBook,
						firstName,
						lastName
					};

					const response = await fetch(`${this.API_BASE_URL}/api/v1/Authors`, {
						method: 'POST',
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json'
						},
						body: JSON.stringify(authorData)
					});

					if (!response.ok) {
						throw new Error(`HTTP error! status: ${response.status}`);
					}

					const createdAuthor = await response.json() as Author;
					
					return {
						content: [
							{
								type: "text",
								text: `Successfully created author:\n\n${JSON.stringify(createdAuthor, null, 2)}`
							}
						]
					};
				} catch (error: unknown) {
					const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
					return {
						content: [
							{
								type: "text",
								text: `Error creating author: ${errorMessage}`
							}
						]
					};
				}
			}
		);

		// Get author by ID
		this.server.tool(
			"get_author_by_id",
			{ id: z.number() },
			async ({ id }) => {
				try {
					const response = await fetch(`${this.API_BASE_URL}/api/v1/Authors/${id}`, {
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
										text: `Author with ID ${id} not found`
									}
								]
							};
						}
						throw new Error(`HTTP error! status: ${response.status}`);
					}

					const author = await response.json() as Author;
					
					return {
						content: [
							{
								type: "text",
								text: `Author details:\n\n${JSON.stringify(author, null, 2)}`
							}
						]
					};
				} catch (error: unknown) {
					const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
					return {
						content: [
							{
								type: "text",
								text: `Error fetching author: ${errorMessage}`
							}
						]
					};
				}
			}
		);

		// Get authors by book ID
		this.server.tool(
			"get_authors_by_book_id",
			{ idBook: z.number() },
			async ({ idBook }) => {
				try {
					const response = await fetch(`${this.API_BASE_URL}/api/v1/Authors/authors/books/${idBook}`, {
						method: 'GET',
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json'
						}
					});

					if (!response.ok) {
						throw new Error(`HTTP error! status: ${response.status}`);
					}

					const authors = await response.json() as Author[];
					
					return {
						content: [
							{
								type: "text",
								text: `Found ${authors.length} authors for book ID ${idBook}:\n\n${JSON.stringify(authors, null, 2)}`
							}
						]
					};
				} catch (error: unknown) {
					const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
					return {
						content: [
							{
								type: "text",
								text: `Error fetching authors for book: ${errorMessage}`
							}
						]
					};
				}
			}
		);

		// Update author by ID
		this.server.tool(
			"update_author",
			{
				id: z.number(),
				idBook: z.number().optional(),
				firstName: z.string().optional(),
				lastName: z.string().optional()
			},
			async ({ id, idBook, firstName, lastName }) => {
				try {
					const updateData: Partial<Author> = {};
					if (idBook !== undefined) updateData.idBook = idBook;
					if (firstName !== undefined) updateData.firstName = firstName;
					if (lastName !== undefined) updateData.lastName = lastName;

					const response = await fetch(`${this.API_BASE_URL}/api/v1/Authors/${id}`, {
						method: 'PUT',
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({ id, ...updateData })
					});

					if (!response.ok) {
						throw new Error(`HTTP error! status: ${response.status}`);
					}

					const updatedAuthor = await response.json() as Author;
					
					return {
						content: [
							{
								type: "text",
								text: `Successfully updated author:\n\n${JSON.stringify(updatedAuthor, null, 2)}`
							}
						]
					};
				} catch (error: unknown) {
					const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
					return {
						content: [
							{
								type: "text",
								text: `Error updating author: ${errorMessage}`
							}
						]
					};
				}
			}
		);

		// Delete author by ID
		this.server.tool(
			"delete_author",
			{ id: z.number() },
			async ({ id }) => {
				try {
					const response = await fetch(`${this.API_BASE_URL}/api/v1/Authors/${id}`, {
						method: 'DELETE',
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json'
						}
					});

					if (!response.ok) {
						throw new Error(`HTTP error! status: ${response.status}`);
					}
					
					return {
						content: [
							{
								type: "text",
								text: `Successfully deleted author with ID ${id}`
							}
						]
					};
				} catch (error: unknown) {
					const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
					return {
						content: [
							{
								type: "text",
								text: `Error deleting author: ${errorMessage}`
							}
						]
					};
				}
			}
		);

		// BOOKS TOOLS

		// Get all books
		this.server.tool(
			"get_books",
			{},
			async () => {
				try {
					const response = await fetch(`${this.API_BASE_URL}/api/v1/Books`, {
						method: 'GET',
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json'
						}
					});

					if (!response.ok) {
						throw new Error(`HTTP error! status: ${response.status}`);
					}

					const books = await response.json() as Book[];
					
					return {
						content: [
							{
								type: "text",
								text: `Found ${books.length} books:\n\n${JSON.stringify(books, null, 2)}`
							}
						]
					};
				} catch (error: unknown) {
					const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
					return {
						content: [
							{
								type: "text",
								text: `Error fetching books: ${errorMessage}`
							}
						]
					};
				}
			}
		);

		// Create a new book
		this.server.tool(
			"create_book",
			{
				id: z.number(),
				title: z.string(),
				description: z.string(),
				pageCount: z.number(),
				excerpt: z.string(),
				publishDate: z.string()
			},
			async ({ id, title, description, pageCount, excerpt, publishDate }) => {
				try {
					const bookData = {
						id,
						title,
						description,
						pageCount,
						excerpt,
						publishDate
					};

					const response = await fetch(`${this.API_BASE_URL}/api/v1/Books`, {
						method: 'POST',
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json'
						},
						body: JSON.stringify(bookData)
					});

					if (!response.ok) {
						throw new Error(`HTTP error! status: ${response.status}`);
					}

					const createdBook = await response.json() as Book;
					
					return {
						content: [
							{
								type: "text",
								text: `Successfully created book:\n\n${JSON.stringify(createdBook, null, 2)}`
							}
						]
					};
				} catch (error: unknown) {
					const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
					return {
						content: [
							{
								type: "text",
								text: `Error creating book: ${errorMessage}`
							}
						]
					};
				}
			}
		);

		// Get book by ID
		this.server.tool(
			"get_book_by_id",
			{ id: z.number() },
			async ({ id }) => {
				try {
					const response = await fetch(`${this.API_BASE_URL}/api/v1/Books/${id}`, {
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
										text: `Book with ID ${id} not found`
									}
								]
							};
						}
						throw new Error(`HTTP error! status: ${response.status}`);
					}

					const book = await response.json() as Book;
					
					return {
						content: [
							{
								type: "text",
								text: `Book details:\n\n${JSON.stringify(book, null, 2)}`
							}
						]
					};
				} catch (error: unknown) {
					const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
					return {
						content: [
							{
								type: "text",
								text: `Error fetching book: ${errorMessage}`
							}
						]
					};
				}
			}
		);

		// Update book by ID
		this.server.tool(
			"update_book",
			{
				id: z.number(),
				title: z.string().optional(),
				description: z.string().optional(),
				pageCount: z.number().optional(),
				excerpt: z.string().optional(),
				publishDate: z.string().optional()
			},
			async ({ id, title, description, pageCount, excerpt, publishDate }) => {
				try {
					const updateData: Partial<Book> = {};
					if (title !== undefined) updateData.title = title;
					if (description !== undefined) updateData.description = description;
					if (pageCount !== undefined) updateData.pageCount = pageCount;
					if (excerpt !== undefined) updateData.excerpt = excerpt;
					if (publishDate !== undefined) updateData.publishDate = publishDate;

					const response = await fetch(`${this.API_BASE_URL}/api/v1/Books/${id}`, {
						method: 'PUT',
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({ id, ...updateData })
					});

					if (!response.ok) {
						throw new Error(`HTTP error! status: ${response.status}`);
					}

					const updatedBook = await response.json() as Book;
					
					return {
						content: [
							{
								type: "text",
								text: `Successfully updated book:\n\n${JSON.stringify(updatedBook, null, 2)}`
							}
						]
					};
				} catch (error: unknown) {
					const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
					return {
						content: [
							{
								type: "text",
								text: `Error updating book: ${errorMessage}`
							}
						]
					};
				}
			}
		);

		// Delete book by ID
		this.server.tool(
			"delete_book",
			{ id: z.number() },
			async ({ id }) => {
				try {
					const response = await fetch(`${this.API_BASE_URL}/api/v1/Books/${id}`, {
						method: 'DELETE',
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json'
						}
					});

					if (!response.ok) {
						throw new Error(`HTTP error! status: ${response.status}`);
					}
					
					return {
						content: [
							{
								type: "text",
								text: `Successfully deleted book with ID ${id}`
							}
						]
					};
				} catch (error: unknown) {
					const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
					return {
						content: [
							{
								type: "text",
								text: `Error deleting book: ${errorMessage}`
							}
						]
					};
				}
			}
		);

		// COVER PHOTOS TOOLS

		// Get all cover photos
		this.server.tool(
			"get_cover_photos",
			{},
			async () => {
				try {
					const response = await fetch(`${this.API_BASE_URL}/api/v1/CoverPhotos`, {
						method: 'GET',
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json'
						}
					});

					if (!response.ok) {
						throw new Error(`HTTP error! status: ${response.status}`);
					}

					const coverPhotos = await response.json() as CoverPhoto[];
					
					return {
						content: [
							{
								type: "text",
								text: `Found ${coverPhotos.length} cover photos:\n\n${JSON.stringify(coverPhotos, null, 2)}`
							}
						]
					};
				} catch (error: unknown) {
					const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
					return {
						content: [
							{
								type: "text",
								text: `Error fetching cover photos: ${errorMessage}`
							}
						]
					};
				}
			}
		);

		// Create a new cover photo
		this.server.tool(
			"create_cover_photo",
			{
				id: z.number(),
				idBook: z.number(),
				url: z.string()
			},
			async ({ id, idBook, url }) => {
				try {
					const coverPhotoData = {
						id,
						idBook,
						url
					};

					const response = await fetch(`${this.API_BASE_URL}/api/v1/CoverPhotos`, {
						method: 'POST',
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json'
						},
						body: JSON.stringify(coverPhotoData)
					});

					if (!response.ok) {
						throw new Error(`HTTP error! status: ${response.status}`);
					}

					const createdCoverPhoto = await response.json() as CoverPhoto;
					
					return {
						content: [
							{
								type: "text",
								text: `Successfully created cover photo:\n\n${JSON.stringify(createdCoverPhoto, null, 2)}`
							}
						]
					};
				} catch (error: unknown) {
					const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
					return {
						content: [
							{
								type: "text",
								text: `Error creating cover photo: ${errorMessage}`
							}
						]
					};
				}
			}
		);

		// Get cover photo by ID
		this.server.tool(
			"get_cover_photo_by_id",
			{ id: z.number() },
			async ({ id }) => {
				try {
					const response = await fetch(`${this.API_BASE_URL}/api/v1/CoverPhotos/${id}`, {
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
										text: `Cover photo with ID ${id} not found`
									}
								]
							};
						}
						throw new Error(`HTTP error! status: ${response.status}`);
					}

					const coverPhoto = await response.json() as CoverPhoto;
					
					return {
						content: [
							{
								type: "text",
								text: `Cover photo details:\n\n${JSON.stringify(coverPhoto, null, 2)}`
							}
						]
					};
				} catch (error: unknown) {
					const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
					return {
						content: [
							{
								type: "text",
								text: `Error fetching cover photo: ${errorMessage}`
							}
						]
					};
				}
			}
		);

		// Get cover photos by book ID
		this.server.tool(
			"get_cover_photos_by_book_id",
			{ idBook: z.number() },
			async ({ idBook }) => {
				try {
					const response = await fetch(`${this.API_BASE_URL}/api/v1/CoverPhotos/books/covers/${idBook}`, {
						method: 'GET',
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json'
						}
					});

					if (!response.ok) {
						throw new Error(`HTTP error! status: ${response.status}`);
					}

					const coverPhotos = await response.json() as CoverPhoto[];
					
					return {
						content: [
							{
								type: "text",
								text: `Found ${coverPhotos.length} cover photos for book ID ${idBook}:\n\n${JSON.stringify(coverPhotos, null, 2)}`
							}
						]
					};
				} catch (error: unknown) {
					const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
					return {
						content: [
							{
								type: "text",
								text: `Error fetching cover photos for book: ${errorMessage}`
							}
						]
					};
				}
			}
		);

		// Update cover photo by ID
		this.server.tool(
			"update_cover_photo",
			{
				id: z.number(),
				idBook: z.number().optional(),
				url: z.string().optional()
			},
			async ({ id, idBook, url }) => {
				try {
					const updateData: Partial<CoverPhoto> = {};
					if (idBook !== undefined) updateData.idBook = idBook;
					if (url !== undefined) updateData.url = url;

					const response = await fetch(`${this.API_BASE_URL}/api/v1/CoverPhotos/${id}`, {
						method: 'PUT',
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({ id, ...updateData })
					});

					if (!response.ok) {
						throw new Error(`HTTP error! status: ${response.status}`);
					}

					const updatedCoverPhoto = await response.json() as CoverPhoto;
					
					return {
						content: [
							{
								type: "text",
								text: `Successfully updated cover photo:\n\n${JSON.stringify(updatedCoverPhoto, null, 2)}`
							}
						]
					};
				} catch (error: unknown) {
					const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
					return {
						content: [
							{
								type: "text",
								text: `Error updating cover photo: ${errorMessage}`
							}
						]
					};
				}
			}
		);

		// Delete cover photo by ID
		this.server.tool(
			"delete_cover_photo",
			{ id: z.number() },
			async ({ id }) => {
				try {
					const response = await fetch(`${this.API_BASE_URL}/api/v1/CoverPhotos/${id}`, {
						method: 'DELETE',
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json'
						}
					});

					if (!response.ok) {
						throw new Error(`HTTP error! status: ${response.status}`);
					}
					
					return {
						content: [
							{
								type: "text",
								text: `Successfully deleted cover photo with ID ${id}`
							}
						]
					};
				} catch (error: unknown) {
					const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
					return {
						content: [
							{
								type: "text",
								text: `Error deleting cover photo: ${errorMessage}`
							}
						]
					};
				}
			}
		);

		// USERS TOOLS

		// Get all users
		this.server.tool(
			"get_users",
			{},
			async () => {
				try {
					const response = await fetch(`${this.API_BASE_URL}/api/v1/Users`, {
						method: 'GET',
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json'
						}
					});

					if (!response.ok) {
						throw new Error(`HTTP error! status: ${response.status}`);
					}

					const users = await response.json() as User[];
					
					return {
						content: [
							{
								type: "text",
								text: `Found ${users.length} users:\n\n${JSON.stringify(users, null, 2)}`
							}
						]
					};
				} catch (error: unknown) {
					const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
					return {
						content: [
							{
								type: "text",
								text: `Error fetching users: ${errorMessage}`
							}
						]
					};
				}
			}
		);

		// Create a new user
		this.server.tool(
			"create_user",
			{
				id: z.number(),
				userName: z.string(),
				password: z.string()
			},
			async ({ id, userName, password }) => {
				try {
					const userData = {
						id,
						userName,
						password
					};

					const response = await fetch(`${this.API_BASE_URL}/api/v1/Users`, {
						method: 'POST',
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json'
						},
						body: JSON.stringify(userData)
					});

					if (!response.ok) {
						throw new Error(`HTTP error! status: ${response.status}`);
					}

					const createdUser = await response.json() as User;
					
					return {
						content: [
							{
								type: "text",
								text: `Successfully created user:\n\n${JSON.stringify(createdUser, null, 2)}`
							}
						]
					};
				} catch (error: unknown) {
					const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
					return {
						content: [
							{
								type: "text",
								text: `Error creating user: ${errorMessage}`
							}
						]
					};
				}
			}
		);

		// Get user by ID
		this.server.tool(
			"get_user_by_id",
			{ id: z.number() },
			async ({ id }) => {
				try {
					const response = await fetch(`${this.API_BASE_URL}/api/v1/Users/${id}`, {
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
										text: `User with ID ${id} not found`
									}
								]
							};
						}
						throw new Error(`HTTP error! status: ${response.status}`);
					}

					const user = await response.json() as User;
					
					return {
						content: [
							{
								type: "text",
								text: `User details:\n\n${JSON.stringify(user, null, 2)}`
							}
						]
					};
				} catch (error: unknown) {
					const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
					return {
						content: [
							{
								type: "text",
								text: `Error fetching user: ${errorMessage}`
							}
						]
					};
				}
			}
		);

		// Update user by ID
		this.server.tool(
			"update_user",
			{
				id: z.number(),
				userName: z.string().optional(),
				password: z.string().optional()
			},
			async ({ id, userName, password }) => {
				try {
					const updateData: Partial<User> = {};
					if (userName !== undefined) updateData.userName = userName;
					if (password !== undefined) updateData.password = password;

					const response = await fetch(`${this.API_BASE_URL}/api/v1/Users/${id}`, {
						method: 'PUT',
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({ id, ...updateData })
					});

					if (!response.ok) {
						throw new Error(`HTTP error! status: ${response.status}`);
					}

					const updatedUser = await response.json() as User;
					
					return {
						content: [
							{
								type: "text",
								text: `Successfully updated user:\n\n${JSON.stringify(updatedUser, null, 2)}`
							}
						]
					};
				} catch (error: unknown) {
					const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
					return {
						content: [
							{
								type: "text",
								text: `Error updating user: ${errorMessage}`
							}
						]
					};
				}
			}
		);

		// Delete user by ID
		this.server.tool(
			"delete_user",
			{ id: z.number() },
			async ({ id }) => {
				try {
					const response = await fetch(`${this.API_BASE_URL}/api/v1/Users/${id}`, {
						method: 'DELETE',
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json'
						}
					});

					if (!response.ok) {
						throw new Error(`HTTP error! status: ${response.status}`);
					}
					
					return {
						content: [
							{
								type: "text",
								text: `Successfully deleted user with ID ${id}`
							}
						]
					};
				} catch (error: unknown) {
					const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
					return {
						content: [
							{
								type: "text",
								text: `Error deleting user: ${errorMessage}`
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
