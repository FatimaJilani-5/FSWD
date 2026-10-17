
const student = {
    id: 101,
    name: "Ali",
    completedCourses: ["CS301"],
    registeredCourses: []
};

const course = {
    code: "CS401",
    prerequisite: "CS301",
    seats: 2
};

// 1. Load Student
function loadStudent(studentId, callback) {
    setTimeout(() => {
        if (studentId !== student.id) {
            return callback(new Error("Student does not exist"));
        }

        callback(null, student);
    }, 500);
}

// 2. Check Prerequisites
function checkPrerequisites(student, course, callback) {
    setTimeout(() => {
        if (!student.completedCourses.includes(course.prerequisite)) {
            return callback(new Error("Prerequisite not completed"));
        }

        callback(null, course);
    }, 500);
}

// 3. Check Available Seats
function checkSeats(course, callback) {
    setTimeout(() => {
        if (course.seats <= 0) {
            return callback(new Error("Course is full"));
        }

        callback(null, course);
    }, 500);
}

// 4. Register Course
function registerCourse(student, course, callback) {
    setTimeout(() => {
        if (student.registeredCourses.includes(course.code)) {
            return callback(new Error("Student already registered"));
        }

        student.registeredCourses.push(course.code);
        course.seats--;

        callback(null, {
            studentId: student.id,
            course: course.code,
            status: "REGISTERED"
        });
    }, 500);
}

// Run the registration sequence
loadStudent(101, (error, student) => {
    if (error) {
        return console.log("Error:", error.message);
    }

    checkPrerequisites(student, course, (error, course) => {
        if (error) {
            return console.log("Error:", error.message);
        }

        checkSeats(course, (error, course) => {
            if (error) {
                return console.log("Error:", error.message);
            }

            registerCourse(student, course, (error, result) => {
                if (error) {
                    return console.log("Error:", error.message);
                }

                console.log("Registration successful:");
                console.log(result);
            });
        });
    });
});
