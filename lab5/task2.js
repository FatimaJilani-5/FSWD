
const results = [
    { id: 1, name: 'Ali', department: 'CS', course: 'FSWD', marks: 82 },
    { id: 2, name: 'Sara', department: 'CS', course: 'FSWD', marks: 91 },
    { id: 3, name: 'Usman', department: 'SE', course: 'FSWD', marks: 47 },
    { id: 4, name: 'Hina', department: 'AI', course: 'FSWD', marks: 73 },
    { id: 5, name: 'Ahmed', department: 'SE', course: 'FSWD', marks: 64 },
    { id: 6, name: 'Zoya', department: 'AI', course: 'FSWD', marks: 91 }
];

// A. Grade, status and grade points
function getGrade(marks) {
    if (marks < 0 || marks > 100 || !Number.isFinite(marks)) {
        return 'Invalid';
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

function getGradePoints(grade) {
    const points = {
        'A': 4.0,
        'A-': 3.7,
        'B+': 3.3,
        'B': 3.0,
        'B-': 2.7,
        'C+': 2.3,
        'C': 2.0,
        'F': 0.0
    };

    return points[grade] ?? null;
}

const processedResults = results.map(student => {
    const grade = getGrade(student.marks);

    return {
        ...student,
        grade: grade,
        status: grade === 'Invalid' ? 'INVALID' :
                grade === 'F' ? 'FAIL' : 'PASS',
        gradePoints: getGradePoints(grade)
    };
});

console.log('\nA. PROCESSED RESULTS');
console.log(processedResults);

// B. Ranked merit list
const rankedList = [...processedResults].sort((a, b) => {
    if (b.marks !== a.marks) {
        return b.marks - a.marks;
    }

    return a.name.localeCompare(b.name);
});

console.log('\nB. RANKED MERIT LIST');
console.log(rankedList);

// C. Department statistics
const departmentStats = {};

processedResults.forEach(student => {
    const department = student.department;

    if (!departmentStats[department]) {
        departmentStats[department] = {
            students: 0,
            totalMarks: 0,
            highest: student.marks,
            passed: 0
        };
    }

    departmentStats[department].students++;
    departmentStats[department].totalMarks += student.marks;

    if (student.marks > departmentStats[department].highest) {
        departmentStats[department].highest = student.marks;
    }

    if (student.status === 'PASS') {
        departmentStats[department].passed++;
    }
});

Object.keys(departmentStats).forEach(department => {
    departmentStats[department].average = Number(
        (departmentStats[department].totalMarks /
        departmentStats[department].students).toFixed(2)
    );

    delete departmentStats[department].totalMarks;
});

console.log('\nC. DEPARTMENT STATISTICS');
console.log(departmentStats);

// D. Academic queries
const firstAbove85 = processedResults.find(
    student => student.marks > 85
);

const firstFailedIndex = processedResults.findIndex(
    student => student.status === 'FAIL'
);

const atLeastOneFailed = processedResults.some(
    student => student.status === 'FAIL'
);

const allMarksValid = processedResults.every(
    student => Number.isFinite(student.marks) &&
               student.marks >= 0 &&
               student.marks <= 100
);

const totalMarks = processedResults.reduce(
    (total, student) => total + student.marks, 0
);

const average = totalMarks / processedResults.length;

const aboveAverage = processedResults.filter(
    student => student.marks > average
);

const topThree = rankedList.slice(0, 3);

console.log('\nD. ACADEMIC QUERIES');
console.log('First student scoring above 85:', firstAbove85);
console.log('Index of first failed student:', firstFailedIndex);
console.log('At least one student failed:', atLeastOneFailed);
console.log('All marks valid:', allMarksValid);
console.log('Overall average:', average.toFixed(2));
console.log('Students above average:', aboveAverage);
console.log('Top three students:', topThree);

// Check that original array order is unchanged
console.log('\nOriginal results remain unchanged:');
console.log(results);
