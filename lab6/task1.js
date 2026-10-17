async function getUser() {
    try {
        let response = await fetch("https://jsonplaceholder.typicode.com/users/1");

        if (!response.ok) {
            throw new Error("Failed to fetch user");
        }

        let user = await response.json();
        return user;

    } catch (error) {
        return error;
    }
}

getUser()
    .then(user => console.log(user))
    .catch(error => console.log(error));
    