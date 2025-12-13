import { Link } from 'react-router-dom';

const PageNotFound = () => {
  return (
    <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-slate-800 sm:text-7xl md:text-8xl">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-slate-700 sm:text-3xl">Page not found</h2>
      <p className="mt-3 max-w-md text-slate-500">
        Sorry, we couldn't find the page you're looking for.
      </p>
      <div className="mt-8">
        <Link
          to="/"
          className="inline-flex items-center rounded-md bg-teal-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
        >
          <svg
            className="-ml-1 mr-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          Go back home
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;
