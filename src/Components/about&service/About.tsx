
import { Link } from "react-router-dom";
import {
  TbHeartHandshake,
  TbMessageCircle,
  TbUsers,
  TbWorld,
  TbArrowRight,
} from "react-icons/tb";

const values = [
  {
    icon: TbHeartHandshake,
    title: "Real Connections",
    description:
      "We believe the best social experiences start with genuine relationships and meaningful interactions.",
    color: "from-emerald-400 to-teal-500",
  },
  {
    icon: TbMessageCircle,
    title: "Open Conversations",
    description:
      "Share your thoughts, express yourself, and discover different perspectives through conversations.",
    color: "from-fuchsia-400 to-purple-500",
  },
  {
    icon: TbUsers,
    title: "Stronger Community",
    description:
      "Build relationships, celebrate moments together, and feel part of a welcoming community.",
    color: "from-blue-400 to-indigo-500",
  },
];

export default function About() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950 px-6 py-24 text-white sm:py-32">
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />

        <div className="relative mx-auto max-w-5xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-emerald-300">
            <TbWorld size={18} /> About Connectly
          </span>

          <h1 className="mt-7 text-4xl font-extrabold leading-tight sm:text-6xl">
            Bringing people
            <span className="block bg-gradient-to-r from-emerald-300 to-fuchsia-400 bg-clip-text text-transparent">
              closer together.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            Connectly is a social space designed to help people share
            their experiences, exchange ideas, and build meaningful
            relationships, one interaction at a time.
          </p>

          <Link
            to="/home"
            className="mt-9 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-fuchsia-500 px-6 py-3.5 font-bold text-slate-950 transition hover:scale-105"
          >
            Explore the community <TbArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Mission */}
      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-2 md:items-center lg:px-8">
        <div>
          <p className="font-bold uppercase tracking-widest text-emerald-600">
            Our mission
          </p>

          <h2 className="mt-4 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
            Social media should bring us closer, not further apart.
          </h2>

          <p className="mt-6 leading-8 text-slate-600">
            We created Connectly around a simple idea: everyone has
            something worth sharing. Whether it is a special moment,
            a personal thought, or an everyday experience, your story
            deserves a place to be heard.
          </p>

          <p className="mt-4 leading-8 text-slate-600">
            Our goal is to make sharing easy, conversations enjoyable,
            and connections more meaningful.
          </p>
        </div>

        <div className="relative">
          <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-emerald-300 to-fuchsia-400 opacity-30 blur-xl" />

          <div className="relative rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-200 sm:p-10">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-400 to-fuchsia-500 text-white">
              <TbHeartHandshake size={30} />
            </div>

            <h3 className="mt-6 text-2xl font-bold text-slate-900">
              One community. Many stories.
            </h3>

            <p className="mt-4 leading-7 text-slate-600">
              A place where different experiences meet, ideas grow, and
              people find common ground through sharing and conversation.
            </p>

            <div className="mt-8 h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-emerald-400 to-fuchsia-500" />
            </div>
            <p className="mt-3 text-sm text-slate-500">
              Built around connection and community.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-bold uppercase tracking-widest text-fuchsia-600">
              What matters to us
            </p>
            <h2 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">
              The values behind every connection
            </h2>
            <p className="mt-4 leading-7 text-slate-600">
              These are the principles that shape the Connectly experience.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <article
                  key={value.title}
                  className="group rounded-2xl border border-slate-200 bg-slate-50 p-7 transition duration-300 hover:-translate-y-2 hover:border-transparent hover:bg-white hover:shadow-xl"
                >
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r ${value.color} text-white`}
                  >
                    <Icon size={28} />
                  </div>

                  <h3 className="mt-6 text-xl font-bold text-slate-900">
                    {value.title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-600">
                    {value.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
