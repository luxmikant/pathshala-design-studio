import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🏫</span>
            <span className="font-bold text-xl">Pathshala Design Studio</span>
          </div>
          <div className="flex gap-4">
            <Link
              href="/auth/login"
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Design Impactful Education Programs
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            A gamified journey to create Logical Framework Analysis (LFA) for
            education initiatives across India. Build better programs, measure
            real impact.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/dashboard"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-lg"
            >
              🚀 Start Your Journey
            </Link>
            <Link
              href="#features"
              className="px-8 py-4 border-2 border-gray-300 rounded-lg hover:border-blue-600 font-semibold text-lg"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Journey Preview */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Your LFA Design Journey</h2>
          <p className="text-gray-600">
            Complete quests, earn badges, and build a comprehensive LFA
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 max-w-5xl mx-auto">
          {[
            { level: 1, icon: "🌍", title: "Understanding", desc: "Context & Vision" },
            { level: 2, icon: "👥", title: "Stakeholders", desc: "Map Your Allies" },
            { level: 3, icon: "🛤️", title: "Strategy", desc: "Chart the Path" },
            { level: 4, icon: "📊", title: "Measurement", desc: "Define Success" },
            { level: 5, icon: "📜", title: "Blueprint", desc: "Final LFA" },
          ].map((level) => (
            <div
              key={level.level}
              className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow"
            >
              <div className="text-4xl mb-3">{level.icon}</div>
              <div className="text-xs text-gray-500 mb-1">Level {level.level}</div>
              <h3 className="font-semibold mb-1">{level.title}</h3>
              <p className="text-sm text-gray-600">{level.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Pathshala Design Studio?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Built specifically for Indian education organizations to design,
              plan, and measure education programs effectively.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6">
              <div className="text-5xl mb-4">🎮</div>
              <h3 className="font-semibold text-lg mb-2">Gamified Experience</h3>
              <p className="text-gray-600">
                Complete quests, earn badges, and track your progress through
                an engaging journey-based interface.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="text-5xl mb-4">📚</div>
              <h3 className="font-semibold text-lg mb-2">Pre-built Templates</h3>
              <p className="text-gray-600">
                Start with templates for FLN, Career Readiness, School
                Leadership, and more.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="text-5xl mb-4">🗺️</div>
              <h3 className="font-semibold text-lg mb-2">India-Focused</h3>
              <p className="text-gray-600">
                Built-in geography support for states, districts, and blocks.
                Designed for Indian education context.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="text-5xl mb-4">👥</div>
              <h3 className="font-semibold text-lg mb-2">Team Collaboration</h3>
              <p className="text-gray-600">
                Invite team members, assign roles, and collaborate on LFA
                development together.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="font-semibold text-lg mb-2">Progress Tracking</h3>
              <p className="text-gray-600">
                Track completion, maintain streaks, and visualize your LFA
                development progress.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="text-5xl mb-4">📄</div>
              <h3 className="font-semibold text-lg mb-2">Export & Share</h3>
              <p className="text-gray-600">
                Generate professional PDF/Excel exports and share your LFA
                with stakeholders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Themes Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Education Themes</h2>
            <p className="text-gray-600">Choose your focus area to get started</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-xl border border-amber-200">
              <div className="text-5xl mb-4">📖</div>
              <h3 className="font-bold text-lg mb-2">
                Foundational Literacy & Numeracy
              </h3>
              <p className="text-gray-600">
                Programs focused on early grade reading and math skills
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-xl border border-blue-200">
              <div className="text-5xl mb-4">💼</div>
              <h3 className="font-bold text-lg mb-2">Career Readiness</h3>
              <p className="text-gray-600">
                Programs for employability and vocational skills development
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-xl border border-green-200">
              <div className="text-5xl mb-4">👔</div>
              <h3 className="font-bold text-lg mb-2">School Leadership</h3>
              <p className="text-gray-600">
                Programs for school leaders, principals, and administrators
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Design Your Education Program?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join organizations across India using Pathshala Design Studio to
            create impactful education programs.
          </p>
          <Link
            href="/auth/register"
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-blue-50 font-semibold text-lg"
          >
            🚀 Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <span className="text-2xl">🏫</span>
              <span className="font-bold text-white">Pathshala Design Studio</span>
            </div>
            <div className="text-sm">
              Part of the Shikshagraha ecosystem • Common LFA Platform
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
