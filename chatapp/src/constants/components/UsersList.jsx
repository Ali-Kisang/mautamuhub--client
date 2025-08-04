/* eslint-disable react/prop-types */

const UserList = ({ users }) => {
  // Sort logic for the home page
  const sortedUsers = [...users].sort((a, b) => {
    const rank = { Spa: 1, VVIP: 2, VIP: 3, Regular: 4 };
    return rank[a.accountType.type] - rank[b.accountType.type];
  });

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Users in Selected County</h2>
      <ul className="space-y-4">
        {sortedUsers.map((user) => (
          <li
            key={user._id}
            className="p-4 border rounded-lg shadow-sm hover:bg-gray-100 transition"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">
                {user.personalInfo.username}
              </h3>
              <span
                className={`px-2 py-1 rounded-full text-white ${
                  user.accountType.type === "Spa"
                    ? "bg-green-500"
                    : user.accountType.type === "VVIP"
                    ? "bg-blue-500"
                    : user.accountType.type === "VIP"
                    ? "bg-yellow-500"
                    : "bg-gray-500"
                }`}
              >
                {user.accountType.type}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              County: {user.breadcrumbLocation.county}
            </p>
            <p className="text-sm text-gray-600">
              Services: {user.services.join(", ")}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
