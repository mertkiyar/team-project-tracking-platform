const projectService = require("../src/services/projectService");
const db = require("../src/config/database");

jest.mock("../src/config/database", () => ({
    all: jest.fn(),
    get: jest.fn(),
    run: jest.fn()
}));

describe("Project Service Unit Tests", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("getAll() should return all projects", async () => {
        const mockProjects = [
            { id: 1, title: "Test Project 1", status: "active" },
            { id: 2, title: "Test Project 2", status: "completed" }
        ];
        db.all.mockImplementation((query, params, callback) => {
            callback(null, mockProjects);
        });

        const projects = await projectService.getAll();
        expect(projects).toEqual(mockProjects);
        expect(db.all).toHaveBeenCalledWith("SELECT * FROM projects", [], expect.any(Function));
        expect(db.all).toHaveBeenCalledTimes(1);
    });

    test("getById() should return a single project by valid ID", async () => {
        const mockProject = { id: 1, title: "Test Project 1" };
        db.get.mockImplementation((query, params, callback) => {
            callback(null, mockProject);
        });
        const project = await projectService.getById(1);
        expect(project).toEqual(mockProject);
        expect(db.get).toHaveBeenCalledWith("SELECT * FROM projects WHERE id = ?", [1], expect.any(Function));
    });

    test("search() should return matched projects by title or description", async () => {
        const mockSearchResult = [{ id: 3, title: "Special Task API" }];
        const searchQuery = "API";
        db.all.mockImplementation((query, params, callback) => {
            callback(null, mockSearchResult);
        });

        const result = await projectService.search(searchQuery);
        expect(result).toEqual(mockSearchResult);
        expect(db.all).toHaveBeenCalledWith(
            "SELECT * FROM projects WHERE title LIKE ? OR description LIKE ?",
            [`%${searchQuery}%`, `%${searchQuery}%`],
            expect.any(Function)
        );
    });

    test("delete() should throw error if there are active tasks", async () => {
        db.get.mockImplementation((query, params, callback) => {
            callback(null, { count: 1 });
        });

        await expect(projectService.delete(1)).rejects.toThrow("you cannot delete this project bevause there are active tasks in this project.");
        expect(db.get).toHaveBeenCalled();
        expect(db.run).not.toHaveBeenCalled();
    });
});