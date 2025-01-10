const getTeams = async () => {
    try {
        const response = await fetch('XXXXXXXXXXXXXXXXXXXXXXXXXXX');
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}

export default getTeams;