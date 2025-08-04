import counties from "../kenyaLocations";
import PropTypes from "prop-types";

const CountySelector = ({ counties, setSelectedCounty }) => {
  return (
    <div className="mb-4">
      <label htmlFor="county" className="block text-lg font-medium mb-2">
        Select a County
      </label>
      <select
        id="county"
        className="w-full border border-gray-300 rounded-lg p-2"
        onChange={(e) => setSelectedCounty(e.target.value)}
      >
        <option value="">Select a county</option>
        {counties.map((county) => (
          <option key={county} value={county}>
            {county}
          </option>
        ))}
      </select>
    </div>
  );
};
CountySelector.propTypes = {
  counties: PropTypes.array.isRequired,
  setSelectedCounty: PropTypes.func.isRequired,
};

export default CountySelector;
