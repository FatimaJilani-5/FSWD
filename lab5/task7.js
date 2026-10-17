
const studentData = {
    id: 101,
    name: "Ali",
    completedCourses: ["CS301"],
    registeredCourses: []
};

const courseData = {
    code: "CS401",
    prerequisite: "CS301",
    seats: 2
};

// Helper to simulate asynchronous work
function delay(value, shouldFail = false) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (shouldFail) {
                reject(new Error("Service failed"));
            } else {
                resolve(value);
            }
        }, 500);
    });
}

// Registration services
function getStudent(id) {
    if (id !== studentData.id) {
        return Promise.reject(new Error("Student not found"));
    }

    return delay(studentData);
}

function getCourse(code) {
    if (code !== courseData.code) {
        return Promise.reject(new Error("Course not found"));
    }

    return delay(courseData);
}

function checkPrerequisites(student, course) {
    if (!student.completedCourses.includes(course.prerequisite)) {
        return Promise.reject(new Error("Prerequisite not completed"));
    }

    return delay({ student, course });
}

function checkSeats(student, course) {
    if (course.seats <= 0) {
        return Promise.reject(new Error("Course is full"));
    }

    return delay({ student, course });
}

function registerStudent(student, course) {
    if (student.registeredCourses.includes(course.code)) {
        return Promise.reject(new Error("Already registered"));
    }

    student.registeredCourses.push(course.code);
    course.seats--;

    return delay({
        studentId: student.id,
        course: course.code,
        status: "REGISTERED"
    });
}

// Post-registration services
function sendEmail() {
    return delay("Email sent");
}

function sendSMS() {
    return delay("SMS failed", true);
}

function writeAuditLog() {
    return delay("Audit log written");
}

// Part A and Part B
getStudent(101)
    .then(student => {
        console.log("Student loaded:", student.name);
        return getCourse("CS401").then(course => ({ student, course }));
    })
    .then(({ student, course }) => {
        return checkPrerequisites(student, course);
    })
    .then(({ student, course }) => {
        return checkSeats(student, course);
    })
    .then(({ student, course }) => {
        return registerStudent(student, course);
    })
    .then(result => {
        console.log("Registration:", result);

        // All three services start independently
        return Promise.allSettled([
            sendEmail(),
            sendSMS(),
            writeAuditLog()
        ]);
    })
    .then(results => {
        const names = ["Email", "SMS", "Audit"];

        const report = results.map((result, index) => ({
            service: names[index],
            status: result.status
        }));

        console.log("Post-registration report:");
        console.log(report);
    })
    .catch(error => {
        console.log("Registration error:", error.message);
    })
    .finally(() => {
        console.log("Registration workflow finished.");
    });

// Part C: accept the first successful server response
function courseServer1() {
    return new Promise((resolve, reject) => {
        setTimeout(() => reject(new Error("Server 1 failed")), 300);
    });
}

function courseServer2() {
    return new Promise(resolve => {
        setTimeout(() => resolve({ code: "CS401", seats: 2 }), 600);
    });
}

Promise.any([courseServer1(), courseServer2()])
    .then(course => console.log("First successful course result:", course))
    .catch(error => console.log("All course servers failed:", error.errors));
