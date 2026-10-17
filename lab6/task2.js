function getUser() {
    return fetch("https://jsonplaceholder.typicode.com/users/1")
        .then(response => {
            if (!response.ok) {
                throw new Error("User fetching failed");
            }
            return response.json();
        });
}

function getPost() {
    return fetch("https://jsonplaceholder.typicode.com/posts/1")
        .then(response => {
            if (!response.ok) {
                throw new Error("Post fetching failed");
            }
            return response.json();
        });
}

Promise.all([getUser(), getPost()])
    .then(data => {
        if (data[0].id && data[1].id) {
            console.log("Both data are valid");
            console.log(data);
        } else {
            throw new Error("Invalid data");
        }
    })
    .catch(error => {
        console.log(error.message);
    });