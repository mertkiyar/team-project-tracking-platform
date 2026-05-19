# Team Project Tracking Platform

A web application designed to help teams track projects, manage tasks, and organize team members efficiently.

## System Setup

To run this project, you need to have Node.js installed on your system.

1. Clone or download the repository to your local machine.
2. Open a terminal and navigate to the root directory of the project.
3. Run the following command to install the required dependencies:

   ```bash
   npm install
   ```
4. Configure your database settings in the `src/config/database.js` file.

## Execution Steps

Once the setup is complete and dependencies are installed, you can start the application by running:

```bash
npm start
```
Or alternatively:
```bash
node src/app.js
```

The application will launch a local server. You can access the user interface by opening a web browser and navigating to the specified local port (e.g., http://localhost:3000) or by accessing the files in the `public/` folder.

## API Usage

This project includes a backend API to interact with the platform's data. Below are the primary route modules available in the system:

- **Authentication (/auth):** Handle user login and registration.
- **Users (/users):** Manage user accounts and profiles.
- **Projects (/projects):** Create, retrieve, update, and delete projects.
- **Tasks (/tasks):** Manage tasks associated with specific projects.
- **Members (/members):** Manage team members and their roles.

You can use standard HTTP methods (GET, POST, PUT, DELETE) to interact with these endpoints. Use API testing tools like Postman to submit requests to the server.

## How to Reproduce

1. Extract the project files into a folder.
2. Check that Node.js is installed by running `node -v` in your terminal.
3. Install package dependencies using `npm install`.
4. Ensure your database is running and configured correctly.
5. Start the server using `node src/app.js`.
6. Open your browser and navigate to the local host address printed in the terminal, or interact with the API endpoints directly.