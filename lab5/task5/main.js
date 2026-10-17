
import Student from './students.js';

import {
    calculateGrade as getGrade,
    calculateAverage,
    calculateGPA
} from './gradeutil.js';

import {
    processTranscript,
    convertReportToJSON
} from './transcriptservice.js';

const rawData = `
[
    {
        "id": 101,
        "name": "Ali",
        "courses": [
            { "code": "CS301", "marks": 81 },
            { "code": "CS302", "marks": 74 }
        ]
    }
]
`;

try {
    const report = processTranscript(rawData);

    console.log('Transcript report:');
    console.log(convertReportToJSON(report));

    console.log('\nGrade of 81:', getGrade(81));
    console.log('Average:', calculateAverage([
        { marks: 81 },
        { marks: 74 }
    ]));
    console.log('GPA:', calculateGPA([
        { marks: 81 },
        { marks: 74 }
    ]));

    const student = new Student(102, 'Sara', []);
    console.log('New student:', student);
} catch (error) {
    console.log(error.name + ': ' + error.message);
} finally {
    console.log('Transcript processing finished.');
}
