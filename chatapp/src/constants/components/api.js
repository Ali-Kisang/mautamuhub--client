const server = "http://localhost:5000/api/v2/";

export const fetchGroupedUsers = async () => {
  try {
    const response = await fetch(`${server}/counties/grouped`);
    if (!response.ok) throw new Error("Failed to fetch data");
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};
