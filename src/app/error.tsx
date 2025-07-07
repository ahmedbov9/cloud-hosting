'use client';

import Link from 'next/link';

interface ErrorPageProps {
  error: Error;
  reset: () => void;
}

const ErrorPage = ({ error, reset }: ErrorPageProps) => {
  return (
    <div className="fix-height pt-7 text-center">
      <div className="text-3xl text-red-600 font-semibold ">
        Something went wrong
      </div>
      <h2 className="text-gray-700 my-3 text-xl">
        Error Message : <span>{error.message} </span>
      </h2>
      <button
        onClick={() => reset()}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full cursor-pointer transition-all"
      >
        try Again
      </button>
      <Link href={'/'} className="text-xl underline text-blue-700 block mt-6">
        Go To Home Page
      </Link>
    </div>
  );
};

export default ErrorPage;
