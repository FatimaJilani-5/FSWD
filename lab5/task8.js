
const API = "http://campusflow.test";

// Fake data for testing
const fakeData = {
    "/users": [
        { id: 101, name: "Ali", department: "CS" },
        { id: 102, name: "Sara", department: "SE" },
        { id: 103, name: "Ahmed", department: "CS" },
        { id: 104, name: "Hina", department: "AI" }
    ],

    "/courses": [
        { id: 1, name: "Programming" },
        { id: 2, name: "Database" },
        { id: 3, name: "Algorithms" }
    ],

    "/results": [
        { studentId: 101, marks: 85 },
        { studentId: 102, marks: 92 },
        { studentId: 103, marks: 42 },
        { studentId: 104, marks: 76 }
    ]
};

// Fake Fetch API
function fakeFetch(url, options = {}) {
    return new Promise((resolve, reject) => {
        const path = new URL(url).pathname;

        let delay = path === "/slow" ? 3000 : 300;

        const timer = setTimeout(() => {
            if (path === "/network") {
                return reject(new TypeError("Network failure"));
            }

            if (path === "/invalid-json") {
                return resolve({
                    ok: true,
                    status: 200,
                    json: () => Promise.reject(new SyntaxError("Invalid JSON"))
                });
            }

            if (path === "/fail404") {
                return resolve({ ok: false, status: 404 });
            }

            if (path === "/fail500") {
                return resolve({ ok: false, status: 500 });
            }

            if (!fakeData[path]) {
                return resolve({ ok: false, status: 404 });
            }

            resolve({
                ok: true,
                status: 200,
                json: () => Promise.resolve(fakeData[path])
            });
        }, delay);

        if (options.signal) {
            if (options.signal.aborted) {
                clearTimeout(timer);
                return reject(new DOMException("Aborted", "AbortError"));
            }

            options.signal.addEventListener("abort", () => {
                clearTimeout(timer);
                reject(new DOMException("Aborted", "AbortError"));
            }, { once: true });
        }
    });
}

// Get JSON and handle HTTP errors
async function getJSON(url, fetchImplementation = fakeFetch) {
    const response = await fetchImplementation(url);

    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }

    return await response.json();
}

// Load all dashboard data concurrently
async function loadDashboard() {
    const [users, courses, results] = await Promise.all([
        getJSON(`${API}/users`),
        getJSON(`${API}/courses`),
        getJSON(`${API}/results`)
    ]);

    const totalStudents = users.length;
    const totalCourses = courses.length;

    const overallAverage = results.length
        ? results.reduce((sum, result) => sum + result.marks, 0) / results.length
        : 0;

    const studentResults = users.map(user => {
        const studentMarks = results
            .filter(result => result.studentId === user.id)
            .map(result => result.marks);

        const average = studentMarks.length
            ? studentMarks.reduce((sum, marks) => sum + marks, 0) / studentMarks.length
            : 0;

        return {
            name: user.name,
            department: user.department,
            average
        };
    });

    const highestPerformer = studentResults.length
        ? studentResults.reduce((best, student) =>
            student.average > best.average ? student : best)
        : null;

    const failedStudents = studentResults.filter(
        student => student.average < 50
    ).length;

    const departments = {};

    studentResults.forEach(student => {
        if (!departments[student.department]) {
            departments[student.department] = {
                students: 0,
                totalMarks: 0
            };
        }

        departments[student.department].students++;
        departments[student.department].totalMarks += student.average;
    });

    for (const department in departments) {
        const data = departments[department];

        data.average = Number(
            (data.totalMarks / data.students).toFixed(2)
        );

        delete data.totalMarks;
    }

    console.log({
        totalStudents,
        totalCourses,
        overallAverage: Number(overallAverage.toFixed(2)),
        highestPerformer,
        failedStudents,
        departments
    });
}

// Timeout wrapper
async function fetchWithTimeout(
    url,
    milliseconds,
    fetchImplementation = fakeFetch
) {
    const controller = new AbortController();

    const timer = setTimeout(() => {
        controller.abort();
    }, milliseconds);

    try {
        return await getJSON(url, (url) =>
            fetchImplementation(url, { signal: controller.signal })
        );
    } catch (error) {
        if (error.name === "AbortError") {
            throw new Error("Request timed out");
        }

        throw error;
    } finally {
        clearTimeout(timer);
    }
}

// Run dashboard
loadDashboard().catch(error => {
    console.log("Dashboard error:", error.message);
});

// Test different failures and the timeout
async function testErrors() {
    const testURLs = [
        "/fail404",
        "/fail500",
        "/network",
        "/invalid-json"
    ];

    for (const path of testURLs) {
        try {
            await getJSON(`${API}${path}`);
        } catch (error) {
            console.log(path, ":", error.message);
        }
    }

    try {
        await fetchWithTimeout(`${API}/slow`, 500);
    } catch (error) {
        console.log("/slow:", error.message);
    }
}

testErrors();
