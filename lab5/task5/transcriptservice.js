
import Student from './students.js';
import {
    calculateAverage,
    calculateGPA,
    calculateGrade as grade
} from './gradeutil.js';

export function processTranscript(rawData) {
    let data;

    try {
        data = JSON.parse(rawData);
    } catch {
        throw new SyntaxError('Malformed JSON data');
    }

    if (!Array.isArray(data)) {
        throw new TypeError('Transcript must be an array');
    }

    const ids = [];
    const report = [];

    for (const item of data) {
        if (item.id === undefined || item.id === null || item.id === '') {
            throw new TypeError('Student ID is missing');
        }

        if (ids.includes(item.id)) {
            throw new Error('Duplicate student ID: ' + item.id);
        }

        ids.push(item.id);

        if (typeof item.name !== 'string' || !item.name.trim()) {
            throw new TypeError('Student name is missing');
        }

        if (!Array.isArray(item.courses)) {
            throw new TypeError('Courses must be an array');
        }

        for (const course of item.courses) {
            if (typeof course.code !== 'string' || !course.code.trim()) {
                throw new TypeError('Course code is missing');
            }

            if (typeof course.marks !== 'number' ||
                !Number.isFinite(course.marks)) {
                throw new TypeError('Course marks must be numeric');
            }

            if (course.marks < 0 || course.marks > 100) {
                throw new RangeError('Course marks must be 0-100');
            }
        }

        const student = new Student(item.id, item.name, item.courses);

        report.push({
            id: student.id,
            name: student.name,
            courses: student.courses.map(course => ({
                code: course.code,
                marks: course.marks,
                grade: grade(course.marks)
            })),
            average: calculateAverage(student.courses),
            gpa: calculateGPA(student.courses)
        });
    }

    return report;
}

export function convertReportToJSON(report) {
    return JSON.stringify(report, null, 2);
}
