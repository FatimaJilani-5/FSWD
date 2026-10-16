
var name = "Fatima";
var age = 21;
var isStudent = true;
var university = "Air University";
var city = "Islamabad";


var biography = {
    name: name,
    age: age,
    isStudent: isStudent,
    university: university,

    address: {
        city: city,
        country: "Pakistan"
    },

    degreeProgram: {
        degree: "BS Computer Science",
        semester: 5
    }
};


console.log("Name: " + biography.name);
console.log("Age: " + biography.age);
console.log("Student: " + biography.isStudent);
console.log("University: " + biography.university);
console.log("City: " + biography.address.city);
console.log("Country: " + biography.address.country);
console.log("Degree: " + biography.degreeProgram.degree);
console.log("Semester: " + biography.degreeProgram.semester);