# To-Do App

This repository contains a simple To-Do application built with Node.js, Express.js, and MongoDB. Users can register, log in, create, update, and delete their to-do items.

## Installation

### Clone the Repository:
```bash
git clone <repository-url>
```
**Navigate to the Project Directory:**
```bash
cd todo-app
```
**Install Dependencies:**
```bash
npm install
```
**Set Up MongoDB:**
- Ensure you have MongoDB installed and running on your system.
- Create a MongoDB database named todo_app.
**Execution**
Start the Server:
```bash
node server.js
```
**Register a User:**
Make a POST request to /register endpoint with JSON body containing username and password.
**Example:**

```json
{
  "username": "example_user",
  "password": "password123"
}
```
**Log In:**
Make a POST request to /login endpoint with JSON body containing username and password.
**Example:**

```json
{
  "username": "example_user",
  "password": "password123"
}
```
Upon successful login, you'll receive a JWT token.

**Create a To-Do:**
Make a POST request to /todos endpoint with a valid JWT token in the Authorization header and JSON body containing task and completed.
**Example:**

```json
{
  "task": "Complete assignment",
  "completed": false
}
```
**Update a To-Do:**
Make a PUT request to /todos/:id endpoint with a valid JWT token in the Authorization header and JSON body containing task and/or completed.
**Example:**

```json
{
  "task": "Update assignment status",
  "completed": true
}
```
**Delete a To-Do:**
Make a DELETE request to /todos/:id endpoint with a valid JWT token in the Authorization header.
**Example:**

```bash
Copy code
DELETE /todos/your_todo_id
```
# Notes
-Ensure MongoDB is running before starting the server.

-JWT token received upon login must be included in the Authorization header for authenticated requests to /todos, /todos/:id.

-Replace <repository-url> with the actual URL of the repository you've cloned.

-Customize environment variables such as PORT and MongoDB URI as needed in the server.js file.

-Ensure your environment has Node.js and npm installed.

# Authors
Srijanna Das
