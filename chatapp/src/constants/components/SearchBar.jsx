import { BsSearchHeart } from "react-icons/bs";

const SearchBar = () => {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="text"
        placeholder="Search..."
        className="bg-pink md:w-[400px] px-4 py-2 rounded-md border focus:outline-none focus:ring focus:border-coralPink focus:ring-coralPink focus:ring-opacity-50 placeholder-gray-400"
      />
      <button className="flex items-center bg-coralPink text-white px-4 py-2 rounded-md hover:bg-pink-600 transition duration-300">
        <BsSearchHeart className="mr-2 text-white text-lg" />
        <span>Search</span>
      </button>
    </div>
  );
};

export default SearchBar;
