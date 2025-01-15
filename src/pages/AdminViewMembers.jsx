import { useEffect, useState } from "react";

const ViewMembers = () => {
    const [members, setMembers] = useState([]);

    useEffect(() => {
        const fetchMembers = async () => {
            const response = await fetch("https://j5tva2aa4m.execute-api.eu-west-1.amazonaws.com/members");
            const data = await response.json();
            setMembers(data);
        };
        fetchMembers();
    }, []);

    return (
        <div className="w-full p-4 m-4">
            <h3 className="font-semibold">Team Members</h3>
            <table className="table-auto w-full motion-preset-blur-right mt-2">
                <thead className="bg-gray-300 cursor-pointer">
                    <th className="border border-gray-400 px-2" >#</th>
                    <th className="border border-gray-400 text-left px-2" >Name</th>
                    <th className="border border-gray-400 text-left px-2" >Email</th>
                </thead>
                <tbody>
                    {members.map((member, index) => (
                        <tr key={member.Sub} className="cursor-pointer hover:bg-gray-100" >
                            <td className="border border-gray-400 text-left px-2">{index + 1}</td>
                            <td className="border border-gray-400 text-left px-2">{member.Username}</td>
                            <td className="border border-gray-400 text-left px-2">{member.Email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default ViewMembers;