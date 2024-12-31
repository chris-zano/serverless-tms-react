class User {
    constructor(id, email, role, username) {
        this.id = id;
        this.email = email;
        this.role = role;
        this.username = username;
    }

    checkUser = async () => {
        const user_id = this.id;
        const request = await fetch(`https://pwe7hvogc6.execute-api.eu-west-1.amazonaws.com/users?id=${user_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            mode: 'cors'
        });

        const response = await request.json();
        if (typeof response === 'string') {
            return {
                status: false,
                message: response
            };
        }
        return {
            status: true,
            message: response
        };
    }

    createUser = async () => {
        const request = await fetch('https://pwe7hvogc6.execute-api.eu-west-1.amazonaws.com/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            mode: 'cors',
            body: JSON.stringify({
                id: this.id,
                email: this.email,
                role: this.role,
                username: this.username
            })
        });

        const response = await request.json();
        return response;
    }
}

export default User;