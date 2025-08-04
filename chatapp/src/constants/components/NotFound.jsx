const NotFound = () => {
  return (
    <div className="flex items-center justify-center p-4 flex-col space-y-4">
      <h1 className="sm:text-4xl text-red-500 text-sm">
        404 Error! | Page Not Found
      </h1>
      <a href="/">
        <button className="px-4 py-2 bg-coralPink text-white rounded-lg hover:bg-pink transition duration-200 font-medium hover:cursor-pointer sm:mt-4 sm:mb-4 sm:text-lg text-sm">
          Go Home
        </button>
      </a>
    </div>
  );
};

export default NotFound;
