const http = require('node:http');

let students = [];
let teachers = [];
let attendance = [];
let marks = [];

let studentId = 1;
let teacherId = 1;
let attendanceId = 1;
let marksId = 1;

const server = http.createServer(async (req, res) => {

    const send = (status, body) => {
        res.writeHead(status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(body));
    };

    const readBody = async () => {
        let raw = '';

        for await (const chunk of req) {
            raw += chunk;

            if (Buffer.byteLength(raw) > 65536) {
                throw new Error('Too large');
            }
        }

        return JSON.parse(raw);
    };

    try {

        const parts = req.url.split('/').filter(Boolean);
        const moduleName = parts[0];
        const id = parts[1] ? Number(parts[1]) : null;

        let data;
        let nextId;

        // Select module
        if (moduleName === 'students') {
            data = students;
            nextId = 'student';
        } else if (moduleName === 'teachers') {
            data = teachers;
            nextId = 'teacher';
        } else if (moduleName === 'attendance') {
            data = attendance;
            nextId = 'attendance';
        } else if (moduleName === 'marks') {
            data = marks;
            nextId = 'marks';
        } else {
            return send(404, { error: 'Module not found' });
        }

        // READ ALL
        if (req.method === 'GET' && !parts[1]) {
            return send(200, data);
        }

        // READ ONE
        if (req.method === 'GET' && parts[1]) {
            const item = data.find(item => item.id === id);

            if (!item) {
                return send(404, { error: 'Record not found' });
            }

            return send(200, item);
        }

        // CREATE
        if (req.method === 'POST' && !parts[1]) {
            const body = await readBody();

            if (!body || typeof body !== 'object' || Array.isArray(body)) {
                return send(400, { error: 'Invalid data' });
            }

            const requiredFields = {
                students: ['name', 'age', 'class'],
                teachers: ['name', 'subject'],
                attendance: ['studentId', 'date', 'status'],
                marks: ['studentId', 'subject', 'marks']
            };

            for (const field of requiredFields[moduleName]) {
                if (
                    body[field] === undefined ||
                    body[field] === null ||
                    (typeof body[field] === 'string' && !body[field].trim())
                ) {
                    return send(400, { error: `${field} is required` });
                }
            }

            if (
                moduleName === 'attendance' &&
                !['Present', 'Absent', 'Late'].includes(body.status)
            ) {
                return send(400, {
                    error: 'Status must be Present, Absent, or Late'
                });
            }

            if (
                moduleName === 'marks' &&
                (
                    typeof body.marks !== 'number' ||
                    !Number.isFinite(body.marks) ||
                    body.marks < 0 ||
                    body.marks > 100
                )
            ) {
                return send(400, {
                    error: 'Marks must be a number between 0 and 100'
                });
            }

            const idCounters = {
                students: () => studentId++,
                teachers: () => teacherId++,
                attendance: () => attendanceId++,
                marks: () => marksId++
            };

            const record = {
                id: idCounters[nextId](),
                ...body
            };

            data.push(record);

            return send(201, record);
        }

        // UPDATE
        if (req.method === 'PUT' && parts[1]) {
            if (!Number.isInteger(id) || id <= 0) {
                return send(400, { error: 'Invalid ID' });
            }

            const index = data.findIndex(item => item.id === id);

            if (index === -1) {
                return send(404, { error: 'Record not found' });
            }

            const body = await readBody();

            if (!body || typeof body !== 'object' || Array.isArray(body)) {
                return send(400, { error: 'Invalid data' });
            }

            if ('id' in body) {
                return send(400, { error: 'ID cannot be changed' });
            }

            const updated = { ...data[index], ...body };

            if (
                moduleName === 'attendance' &&
                !['Present', 'Absent', 'Late'].includes(updated.status)
            ) {
                return send(400, {
                    error: 'Status must be Present, Absent, or Late'
                });
            }

            if (
                moduleName === 'marks' &&
                (
                    typeof updated.marks !== 'number' ||
                    !Number.isFinite(updated.marks) ||
                    updated.marks < 0 ||
                    updated.marks > 100
                )
            ) {
                return send(400, {
                    error: 'Marks must be a number between 0 and 100'
                });
            }

            data[index] = updated;

            return send(200, updated);
        }

        // DELETE
        if (req.method === 'DELETE' && parts[1]) {
            if (!Number.isInteger(id) || id <= 0) {
                return send(400, { error: 'Invalid ID' });
            }

            const index = data.findIndex(item => item.id === id);

            if (index === -1) {
                return send(404, { error: 'Record not found' });
            }

            const deleted = data.splice(index, 1);

            return send(200, {
                message: 'Record deleted successfully',
                record: deleted[0]
            });
        }

        send(404, { error: 'Route not found' });

    } catch (error) {

        if (error.message === 'Too large') {
            return send(413, { error: 'Request body too large' });
        }

        if (error instanceof SyntaxError) {
            return send(400, { error: 'Invalid JSON' });
        }

        console.error(error);

        send(500, { error: 'Server error' });
    }

});

server.listen(3004, () => {
    console.log('Student Management API running at http://localhost:3004');
});