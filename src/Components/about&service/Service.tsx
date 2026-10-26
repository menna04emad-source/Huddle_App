
import { Link } from "react-router-dom";
import {
  TbMessageCircle,
  TbHeart,
  TbBookmark,
  TbShare3,
  TbUsers,
  TbShieldCheck,
  TbBell,
  TbArrowRight,
} from "react-icons/tb";

const services = [
  {
    icon: TbMessageCircle,
    title: "Share Your Thoughts",
    description:
      "Create posts and express your ideas, experiences, and everyday moments with your community.",
    color: "from-emerald-400 to-teal-500",
  },
  {
    icon: TbHeart,
    title: "React & Engage",
    description:
      "Show appreciation for posts you enjoy and interact with content from people in your community.",
    color: "from-pink-400 to-rose-500",
  },
  {
    icon: TbUsers,
    title: "Discover People",
    description:
      "Explore profiles and discover people whose stories and interests connect with yours.",
    color: "from-blue-400 to-indigo-500",
  },
  {
    icon: TbBookmark,
    title: "Save Your Favorites",
    description:
      "Keep useful or memorable content close so you can find it again when you need it.",
    color: "from-amber-400 to-orange-500",
  },
  {
    icon: TbShare3,
    title: "Spread the Story",
    description:
      "Share interesting content and help great ideas reach more people.",
    color: "from-fuchsia-400 to-purple-500",
  },
  {
    icon: TbBell,
    title: "Stay Updated",
    description:
      "Keep up with relevant activity and notifications from your social experience.",
    color: "from-cyan-400 to-blue-500",
  },
];

export default function Service() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950 px-6 py-24 text-white sm:py-28">
        <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />

        <div className="relative mx-auto max-w-4xl text-center">
          <span className="inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-fuchsia-300">
            Everything in one place
          </span>

          <h1 className="mt-7 text-4xl font-extrabold leading-tight sm:text-6xl">
            More ways to
            <span className="block bg-gradient-to-r from-emerald-300 to-fuchsia-400 bg-clip-text text-transparent">
              stay connected.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            From sharing your daily moments to discovering new perspectives,
            Connectly gives you a space to express yourself and engage
            with your community.
          </p>

          <Link
            to="/home"
            className="mt-9 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-fuchsia-500 px-6 py-3.5 font-bold text-slate-950 transition hover:scale-105"
          >
            Get started <TbArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-bold uppercase tracking-widest text-emerald-600">
            What you can do
          </p>
          <h2 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Everything you need to connect
          </h2>
          <p className="mt-4 leading-7 text-slate-600">
            Simple tools to make your social experience more expressive,
            interactive, and personal.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <article
                key={service.title}
                className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r ${service.color} text-white shadow-lg transition group-hover:scale-110`}
                >
                  <Icon size={28} />
                </div>

                <h3 className="mt-6 text-xl font-bold text-slate-900">
                  {service.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-600">
                  {service.description}
                </p>

                <div className="mt-6 h-1 w-12 rounded-full bg-gradient-to-r from-emerald-400 to-fuchsia-500 transition-all group-hover:w-24" />
              </article>
            );
          })}
        </div>
      </section>

      {/* Community banner */}
      <section className="px-6 pb-20 lg:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-500 to-fuchsia-600 px-7 py-12 text-white sm:px-12 sm:py-16">
          <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full border-[40px] border-white/10" />

          <div className="relative flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-white/80">
                <TbShieldCheck size={22} />
                <span className="text-sm font-semibold uppercase tracking-widest">
                  Your community awaits
                </span>
              </div>

              <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
                Your next connection starts here.
              </h2>

              <p className="mt-4 leading-7 text-white/85">
                Come share a moment, join a conversation, and discover
                what makes every story unique.
              </p>
            </div>

            <Link
              to="/home"
              className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-white px-6 py-3.5 font-bold text-slate-900 transition hover:bg-slate-100 md:self-center"
            >
              Explore Connectly <TbArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
