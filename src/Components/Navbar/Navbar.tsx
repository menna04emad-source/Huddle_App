import { useContext, useState } from 'react';
import { TbCirclesRelation } from 'react-icons/tb';
import { Link, useNavigate } from 'react-router-dom';
import { Authcontext } from '../../Context/AuthContext';
import NotificationBell from '../Pages/Notifications/NotificationBell';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const context = useContext(Authcontext);

  if (!context) {
    throw new Error('Navbar must be inside AuthcontextProvider');
  }

  const { userLogin, setuserLogin } = context;

  function Logout() {
    setuserLogin(null);
    localStorage.removeItem('user Token');
    setIsOpen(false);
    navigate('/login');
  }

  return (
    <>
      <nav className="bg-linear-to-r from-emerald-300 to-fuchsia-500 shadow-md fixed-top">
        {userLogin ? (
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            {/* Logo */}
            <Link
              to="/home"
              className="text-2xl font-bold text-emerald-900"
            >
              <div className="flex items-center justify-center gap-2">
                <TbCirclesRelation />
                Huddle
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden items-center gap-8 md:flex">
              <Link
                to="/profile"
                className="font-medium text-gray-700 transition hover:text-emerald-900"
              >
                About
              </Link>

              <Link
                to="/profile"
                className="font-medium text-gray-700 transition hover:text-emerald-900"
              >
                Service
              </Link>

              

              <Link
                to="/login"
                className="rounded-lg bg-gray-900 px-4 py-2 font-medium text-white transition hover:bg-gray-800"
              >
                Log In
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-md p-2 text-gray-700 hover:bg-gray-100 md:hidden"
              aria-label="Toggle navigation menu"
              aria-expanded={isOpen}
            >
              {isOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        ) : (
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            {/* Logo */}
            <Link
              to="/home"
              className="text-2xl font-bold text-emerald-900"
            >
              <div className="flex items-center justify-center gap-2">
                <TbCirclesRelation />
                Huddle
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden items-center gap-8 md:flex">
              <Link
                to="/home"
                className="font-medium text-gray-700 transition hover:text-emerald-900"
              >
                Home
              </Link>

              <Link
                to="/profile"
                className="font-medium text-gray-700 transition hover:text-emerald-900"
              >
                Profile
              </Link>

              <Link
                to="/about"
                className="font-medium text-gray-700 transition hover:text-emerald-900"
              >
                About
              </Link>

              <Link
                to="/service"
                className="font-medium text-gray-700 transition hover:text-emerald-900"
              >
                Service
              </Link>
               <div className="flex items-center gap-2">
                  <NotificationBell />
                </div>
                <div className="my-3 text-center">
  <Link
    to="/change-password"
    className="text-emerald-600 underline hover:text-emerald-700"
  >
    Change Password?
  </Link>
</div>

              <button
                onClick={Logout}
                className="rounded-lg bg-gray-900 px-4 py-2 font-medium text-white transition hover:bg-gray-800"
              >
                Log Out
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-md p-2 text-gray-700 hover:bg-gray-100 md:hidden"
              aria-label="Toggle navigation menu"
              aria-expanded={isOpen}
            >
              {isOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        )}

        {/* Mobile Menu */}
        {isOpen && (
          <div className="flex flex-col gap-4 border-t border-gray-100 px-4 py-4 md:hidden">
            {userLogin ? (
              <>
                <Link
                  to="/about"
                  onClick={() => setIsOpen(false)}
                  className="font-medium text-gray-700 hover:text-emerald-900"
                >
                  About
                </Link>

                <Link
                  to="/service"
                  onClick={() => setIsOpen(false)}
                  className="font-medium text-gray-700 hover:text-emerald-900"
                >
                  Service
                </Link>

              

                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full rounded-lg bg-emerald-900 px-4 py-2 text-center font-medium text-white transition hover:bg-emerald-700"
                >
                  Log In
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/home"
                  onClick={() => setIsOpen(false)}
                  className="font-medium text-gray-700 hover:text-emerald-900"
                >
                  Home
                </Link>

                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="font-medium text-gray-700 hover:text-emerald-900"
                >
                  Profile
                </Link>

                <Link
                  to="/about"
                  onClick={() => setIsOpen(false)}
                  className="font-medium text-gray-700 hover:text-emerald-900"
                >
                  About
                </Link>

                <Link
                  to="/service"
                  onClick={() => setIsOpen(false)}
                  className="font-medium text-gray-700 hover:text-emerald-900"
                >
                  Service
                </Link>
               <div className="flex items-center gap-2">
                  <NotificationBell />
          
                </div>
                <div className="my-3 text-center">
  <Link
    to="/change-password"
    className="text-emerald-600 underline hover:text-emerald-700"
  >
    Change Password?
  </Link>
</div>

                <button
                  type="button"
                  onClick={Logout}
                  className="w-full rounded-lg bg-gray-900 px-4 py-2 font-medium text-white transition hover:bg-gray-800"
                >
                  Log Out
                </button>
              </>
            )}
          </div>
        )}
      </nav>
    </>
  );
}
