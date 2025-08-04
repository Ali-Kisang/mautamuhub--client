import { useParams, useNavigate } from "react-router-dom";
import kenyaLocations from "../kenyaLocations";

function CountyPage() {
  const { countyName } = useParams();
  const navigate = useNavigate();

  const county = kenyaLocations.find((c) => c.name === countyName);

  if (!county) return <p className="text-red-500">County not found!</p>;

  const handleConstituencyClick = (constituencyName) => {
    navigate(`/counties/${countyName}/constituencies/${constituencyName}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">{county.name} Constituencies</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {county.constituencies.map((constituency) => (
          <button
            key={constituency.name}
            onClick={() => handleConstituencyClick(constituency.name)}
            className="p-4 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-700 transition"
          >
            {constituency.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CountyPage;
