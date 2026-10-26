
import { Link } from "react-router-dom";
import {
  TbCirclesRelation,
  TbBrandGithub,
  TbBrandLinkedin,
  TbBrandInstagram,
  TbArrowUpRight,
} from "react-icons/tb";

export default function Footer() {
  return (
    <footer className="mt-16 bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/home" className="inline-flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-400 to-fuchsia-500 text-2xl">
                <TbCirclesRelation />
              </span>
              <span className="text-2xl font-bold tracking-tight">
                Huddle
              </span>
            </Link>

            <p className="mt-5 max-w-md leading-7 text-slate-400">
              A place to share your moments, discover new stories, and
              stay connected with the people who matter to you.
            </p>

            <div className="mt-6 flex gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="rounded-full border border-slate-700 p-3 text-slate-300 transition hover:border-emerald-400 hover:text-emerald-400"
              >
                <TbBrandGithub size={20} />
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="rounded-full border border-slate-700 p-3 text-slate-300 transition hover:border-emerald-400 hover:text-emerald-400"
              >
                <TbBrandLinkedin size={20} />
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="rounded-full border border-slate-700 p-3 text-slate-300 transition hover:border-fuchsia-400 hover:text-fuchsia-400"
              >
                <TbBrandInstagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-widest text-white">
              Explore
            </h3>
            <ul className="space-y-4 text-slate-400">
              <li>
                <Link
                  to="/home"
                  className="transition hover:text-emerald-400"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="transition hover:text-emerald-400"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/service"
                  className="transition hover:text-emerald-400"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="transition hover:text-emerald-400"
                >
                  My Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-widest text-white">
              Community
            </h3>
            <p className="mb-5 text-sm leading-6 text-slate-400">
              Every connection starts with a conversation. Join the
              community and share your story.
            </p>

            <Link
              to="/home"
              className="inline-flex items-center gap-2 font-semibold text-emerald-400 transition hover:text-fuchsia-400"
            >
              Explore posts <TbArrowUpRight size={19} />
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-slate-800 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Connectly. All rights reserved.
          </p>
          <p>Made for meaningful connections.</p>
        </div>
      </div>
    </footer>
  );
}
