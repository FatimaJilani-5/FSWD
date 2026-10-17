
const student = {
    id: 101,
    name: 'Fatima',
    marks: 0,
    scholarship: false,
    address: {
        city: 'Islamabad',
        sector: 'F-10'
    },
    contact: {
        email: 'fatima@university.edu'
    }
};

const update = {
    name: 'Fatima Khan',
    address: {
        city: 'Rawalpindi'
    },
    contact: {
        phone: '03001234567'
    }
};

// Object destructuring
const { id, name: oldName, marks = 50 } = student;

// Nested destructuring
const {
    address: { city, sector }
} = student;


// Array destructuring
const [first, second] = ['Student', 'Faculty'];

// Rest parameters
function showValues(...values) {
    return values;
}

// Object rest
const { scholarship, ...otherDetails } = student;

// Optional chaining
const phone = update.contact?.phone;

// Nullish coalescing
const studentMarks = student.marks ?? 50;

// Property shorthand
const details = { id, oldName, marks };

// Profile update function
function updateProfile(original, changes) {
    return {
        ...original,
        ...changes,

        address: {
            ...original.address,
            ...changes.address
        },

        contact: {
            ...original.contact,
            ...changes.contact
        }
    };
}

const updatedStudent = updateProfile(student, update);

console.log('Original student:');
console.log(student);

console.log('\nUpdated student:');
console.log(updatedStudent);

// Reference comparison
console.log('\nReference comparisons:');
console.log('Original === Updated:', student === updatedStudent);
console.log('Original address === Updated address:',
    student.address === updatedStudent.address);
console.log('Original contact === Updated contact:',
    student.contact === updatedStudent.contact);

// Demonstrating the other concepts
console.log('\nOther concepts:');
console.log('Array destructuring:', first, second);
console.log('Rest parameters:', showValues(10, 20, 30));
console.log('Object rest:', otherDetails);
console.log('Optional chaining:', phone);
console.log('Nullish coalescing:', studentMarks);
console.log('Property shorthand:', details);
