const asyncHandler = require("express-async-handler");
const { getAllStudents, addNewStudent, getStudentDetail, setStudentStatus, updateStudent } = require("./students-service");

/**
 * Handle GET request to fetch all students
 * Added proper error handling
 */
const handleGetAllStudents = asyncHandler(async (req, res) => {
    //write your code
    // console.log("checked that user");
    const students = await getAllStudents(req);
    res.json({ students });

});

/**
 * Handle POST request to add a new student
 * Added input validation and better error handling
 */
const handleAddStudent = asyncHandler(async (req, res) => {
    try {
        // Basic validation could be added here if needed
        if (!req.body.name || !req.body.email) {
            return res.status(400).json({ message: 'Name and email are required' });
        }

        const result = await addNewStudent(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
});

/**
 * Handle PUT request to update an existing student
 * Added proper parsing of ID and improved error handling
 */
const handleUpdateStudent = asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid student ID' });
    }

    try {
        const updateData = { ...req.body, userId: id };
        const message = await updateStudent(updateData);
        res.json({ message });
    } catch (error) {
        throw error; // asyncHandler will catch this
    }
});

/**
 * Handle GET request to fetch a specific student's details
 * Added ID validation and improved error handling
 */
const handleGetStudentDetail = asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid student ID' });
    }

    try {
        const student = await getStudentDetail(id);

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.json(student);
    } catch (error) {
        throw error; // asyncHandler will catch this
    }
});

/**
 * Handle PATCH request to update a student's status
 * Added better validation and error handling
 */
const handleStudentStatus = asyncHandler(async (req, res) => {
    const userId = parseInt(req.params.id); // From URL: /:id/status
    const { status } = req.body; // From body: { status: "true | false" }
    const reviewerId = req.user?.id; // From auth middleware (e.g., JWT)

    if (isNaN(userId)) {
        return res.status(400).json({ message: 'Invalid student ID' });
    }

    if (status === undefined) {
        return res.status(400).json({ message: 'Status is required' });
    }

    try {
        const message = await setStudentStatus({ userId, reviewerId, status });
        res.json(message);
    } catch (error) {
        throw error; // asyncHandler will catch this
    }
});

module.exports = {
    handleGetAllStudents,
    handleGetStudentDetail,
    handleAddStudent,
    handleStudentStatus,
    handleUpdateStudent,
};