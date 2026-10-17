
const applicants = [
    {
        id: 'A101',
        name: 'Alex',
        age: '19',
        matricMarks: '91',
        intermediateMarks: '87',
        entryTest: '78',
        program: 'BSCS',
        feePaid: 'true'
    },
    {
        id: 'A102',
        name: 'Aaron',
        age: 'twenty',
        matricMarks: '88',
        intermediateMarks: '',
        entryTest: '72',
        program: 'BSSE',
        feePaid: 'false'
    },
    {
        id: 'A103',
        name: 'Hannah',
        age: '18',
        matricMarks: '76',
        intermediateMarks: '83',
        entryTest: '91',
        program: 'BSAI',
        feePaid: 'true'
    }
];

const supportedPrograms = ['BSCS', 'BSSE', 'BSAI'];
const results = [];

function processApplicant(applicant) {
    const age = Number(applicant.age);
    const matric = Number(applicant.matricMarks);
    const intermediate = Number(applicant.intermediateMarks);
    const entryTest = Number(applicant.entryTest);

    const errors = [];

    if (applicant.age.trim() === '' || !Number.isFinite(age)) {
        errors.push('Invalid age');
    } else if (age < 17 || age > 30) {
        errors.push('Age must be between 17 and 30');
    }

    const marks = [matric, intermediate, entryTest];
    const markFields = [
        'Matric marks',
        'Intermediate marks',
        'Entry test marks'
    ];

    marks.forEach((mark, index) => {
        const originalValues = [
            applicant.matricMarks,
            applicant.intermediateMarks,
            applicant.entryTest
        ];

        if (originalValues[index].trim() === '') {
            errors.push(markFields[index] + ' is missing');
        } else if (!Number.isFinite(mark)) {
            errors.push(markFields[index] + ' is not numeric');
        } else if (mark < 0 || mark > 100) {
            errors.push(markFields[index] + ' must be between 0 and 100');
        }
    });

    if (!supportedPrograms.includes(applicant.program)) {
        errors.push('Unsupported program');
    }

    if (errors.length > 0) {
        return {
            id: applicant.id,
            name: applicant.name,
            status: 'INVALID DATA',
            errors: errors
        };
    }

    const merit =
        matric * 0.20 +
        intermediate * 0.30 +
        entryTest * 0.50;

    let status;

    if (merit >= 70 && entryTest >= 60 && intermediate >= 60) {
        status = merit >= 80 ? 'SELECTED' : 'WAITING';
    } else {
        status = 'REJECTED';
    }

    return {
        id: applicant.id,
        name: applicant.name,
        program: applicant.program,
        age: age,
        merit: Number(merit.toFixed(2)),
        feePaid: applicant.feePaid === 'true',
        status: status,
        errors: []
    };
}

// Process all applicants
applicants.forEach(applicant => {
    results.push(processApplicant(applicant));
});

console.log('ADMISSION RESULTS');
console.log(results);

// Summary
const validApplicants = results.filter(
    applicant => applicant.status !== 'INVALID DATA'
);

const invalidApplicants = results.filter(
    applicant => applicant.status === 'INVALID DATA'
);

const rankedApplicants = validApplicants
    .filter(applicant => applicant.merit !== undefined)
    .sort((a, b) => b.merit - a.merit);

const merits = validApplicants
    .filter(applicant => applicant.merit !== undefined)
    .map(applicant => applicant.merit);

const averageMerit = merits.length > 0
    ? merits.reduce((total, merit) => total + merit, 0) / merits.length
    : 0;

const programCounts = {};

applicants.forEach(applicant => {
    const program = supportedPrograms.includes(applicant.program)
        ? applicant.program
        : 'Unsupported/Other';

    programCounts[program] = (programCounts[program] || 0) + 1;
});

console.log('\nADMISSION SUMMARY');
console.log('Valid applicants:', validApplicants.length);
console.log('Invalid applicants:', invalidApplicants.length);
console.log('Highest merit applicant:', rankedApplicants[0] || 'None');
console.log(
    'Lowest valid merit:',
    merits.length > 0 ? Math.min(...merits) : 'None'
);
console.log(
    'Average merit:',
    merits.length > 0 ? Number(averageMerit.toFixed(2)) : 'None'
);
console.log('Program counts:', programCounts);
