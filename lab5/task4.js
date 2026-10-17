
'use strict';

// Parent class
class Person {
    constructor(name, email) {
        this.name = name;
        this.email = email;
    }

    introduce() {
        return `My name is ${this.name} and my email is ${this.email}.`;
    }
}

// Student inherits from Person
class Student extends Person {
    constructor(name, email, rollNo, marks) {
        super(name, email);
        this.rollNo = rollNo;
        this.marks = marks;
    }

    introduce() {
        return super.introduce() +
            ` I am a student. My roll number is ${this.rollNo}.`;
    }

    getResult() {
        return this.marks >= 50 ? 'PASS' : 'FAIL';
    }
}

// FacultyMember inherits from Person
class FacultyMember extends Person {
    constructor(name, email, employeeId, department) {
        super(name, email);
        this.employeeId = employeeId;
        this.department = department;
    }

    introduce() {
        return super.introduce() +
            ` I am a faculty member in ${this.department}.`;
    }
}

// Create objects
const student1 = new Student(
    'Ali', 'ali@university.edu', 'BSCS-101', 82
);

const student2 = new Student(
    'Sara', 'sara@university.edu', 'BSCS-102', 45
);

const teacher1 = new FacultyMember(
    'Ahmed', 'ahmed@university.edu', 'F101', 'Computer Science'
);

const teacher2 = new FacultyMember(
    'Hina', 'hina@university.edu', 'F102', 'Artificial Intelligence'
);

// Store different types of users in one array
const users = [student1, student2, teacher1, teacher2];

console.log('USER INTRODUCTIONS');

users.forEach(user => {
    console.log(user.introduce());
});

console.log('\nSTUDENT RESULTS');
console.log(student1.name, student1.getResult());
console.log(student2.name, student2.getResult());

// instanceof
console.log('\nINSTANCEOF');
console.log(student1 instanceof Student);       // true
console.log(student1 instanceof Person);        // true
console.log(teacher1 instanceof FacultyMember); // true
console.log(teacher1 instanceof Person);        // true

// call() with a guest speaker
const guest = {
    name: 'Dr. Ahmed',
    email: 'ahmed@example.com'
};

console.log('\nCALL');
console.log(Person.prototype.introduce.call(guest));

// bind() creates a method permanently bound to student1
const boundMethod = student1.introduce.bind(student1);

console.log('\nBIND');
console.log(boundMethod());

// Detached method
console.log('\nDETACHED METHOD');

const fn = student1.introduce;

try {
    console.log(fn());
} catch (error) {
    console.log('Detached method error:', error.message);
}


