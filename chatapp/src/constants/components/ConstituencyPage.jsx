import { useParams } from "react-router-dom";
import kenyaLocations from "../kenyaLocations";

function ConstituencyPage() {
  const { countyName, constituencyName } = useParams();

  const county = kenyaLocations.find((c) => c.name === countyName);
  const constituency = county?.constituencies.find(
    (c) => c.name === constituencyName
  );

  if (!constituency)
    return <p className="text-red-500">Constituency not found!</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">
        {constituency.name} Wards in {county.name} County
      </h1>
      <ul className="list-disc pl-6">
        {constituency.wards.map((ward) => (
          <li key={ward} className="mb-2">
            {ward}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ConstituencyPage;
