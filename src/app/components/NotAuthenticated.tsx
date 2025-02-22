import React from "react";

interface NotAuthenticatedProps {
  pageName?: string; // Назва сторінки
  onLoginRedirect?: () => void;
  onSignupRedirect?: () => void;
}

const NotAuthenticated: React.FC<NotAuthenticatedProps> = ({
  pageName = "this page",
  onLoginRedirect = () => (window.location.href = "/login"),
  onSignupRedirect = () => (window.location.href = "/signup"),
}) => {
  return (
    <div className="p-4 text-center">
      <h2 className="text-xl font-bold text-red-500 mb-4">You are not authenticated</h2>
      <p>Please log in or sign up to access {pageName}.</p>
      <div className="mt-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
          onClick={onLoginRedirect}
        >
          Log In
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={onSignupRedirect}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default NotAuthenticated;
