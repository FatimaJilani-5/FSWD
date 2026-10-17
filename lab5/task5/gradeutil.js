
export function calculateGrade(marks) {
    if (marks < 0 || marks > 100 || !Number.isFinite(marks)) {
        throw new RangeError('Marks must be between 0 and 100');
    }

    if (marks >= 85) return 'A';
    if (marks >= 80) return 'A-';
    if (marks >= 75) return 'B+';
    if (marks >= 70) return 'B';
    if (marks >= 65) return 'B-';
    if (marks >= 60) return 'C+';
    if (marks >= 50) return 'C';

    return 'F';
}

export function calculateAverage(courses) {
    if (courses.length === 0) {
        return 0;
    }

    const total = courses.reduce(
        (sum, course) => sum + course.marks, 0
    );

    return Number((total / courses.length).toFixed(2));
}

export function calculateGPA(courses) {
    if (courses.length === 0) {
        return 0;
    }

    const points = {
        A: 4.0,
        'A-': 3.7,
        'B+': 3.3,
        B: 3.0,
        'B-': 2.7,
        'C+': 2.3,
        C: 2.0,
        F: 0.0
    };

    const totalPoints = courses.reduce(
        (sum, course) => sum + points[calculateGrade(course.marks)],
        0
    );

    return Number((totalPoints / courses.length).toFixed(2));
}

