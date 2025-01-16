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
        <div className="flex-col justify-center w-full px-12">
            <h3 className="font-semibold">Team Members</h3>
            <table className="table-auto w-full motion-preset-blur-right mt-2 rounded-l-full">
                <thead className="bg-gray-300 cursor-pointer">
                    <th className="py-4 px-4 text-center rounded-tl-[5ch]" >#</th>
                    <th className="py-4 px-4 text-left" >Name</th>
                    <th className="y-4 px-4 rounded-tr-[5ch] text-left" >Email</th>
                </thead>
                <tbody>
                    {members.map((member, index) => (
                        <tr key={member.Sub} className="cursor-pointer hover:bg-gray-100" >
                            <td className="py-4 px-4 text-center">{index + 1}</td>
                            <td className="py-4 px-4 text-left">{member.Username}</td>
                            <td className="py-4 px-4 text-left">{member.Email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default ViewMembers;