import { useState, useEffect } from "react";
import { fetchGroupedUsers } from "./api";

function GroupedUsers() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUsers = async () => {
      const result = await fetchGroupedUsers();
      if (result) setData(result);
      else setError("Failed to fetch user data.");
      setLoading(false);
    };

    getUsers();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Grouped Users</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {data.map((county) => (
          <div key={county.name} className="p-4 border rounded-lg shadow-md">
            <h2 className="text-xl font-bold">{county.name}</h2>
            <ul className="list-disc pl-4">
              {county.users.map((user) => (
                <li key={user.id}>Meet {user.name} </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GroupedUsers;
