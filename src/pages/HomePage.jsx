import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: "📋",
      title: "Create Unlimited Menus",
      description: "Design custom menus for any occasion or event",
    },
    {
      icon: "👥",
      title: "Share with Guests",
      description: "Get a unique link to share with your guests",
    },
    {
      icon: "✓",
      title: "Track Selections",
      description: "See exactly what guests want to eat or drink",
    },
    {
      icon: "📊",
      title: "Analytics & Export",
      description: "View analytics and export data to CSV or PDF",
    },
  ];

  const steps = [
    {
      number: 1,
      title: "Sign Up & Verify",
      description: "Create your account with email and password",
      details: [
        "Enter your name, email, and phone",
        "Verify your email address",
        "Set a secure password",
      ],
    },
    {
      number: 2,
      title: "Get Your Subdomain",
      description: "Create your unique menu link",
      details: [
        'Choose your subdomain (e.g., "abhi")',
        "Your URL: abhi.guestmenu.com",
        "Share this link with your guests",
      ],
    },
    {
      number: 3,
      title: "Build Your Menu",
      description: "Add categories and menu items",
      details: [
        "Create categories (e.g., Starters, Mains)",
        "Add menu items with descriptions",
        "Set quantities available",
      ],
    },
    {
      number: 4,
      title: "Share & Collect",
      description: "Send link to guests and track selections",
      details: [
        "Share your menu link with guests",
        "Guests browse and select items",
        "View all submissions in real-time",
      ],
    },
    {
      number: 5,
      title: "Manage & Export",
      description: "Manage and analyze your data",
      details: [
        "View guest selections and details",
        "Confirm or cancel submissions",
        "Export data to CSV or PDF",
      ],
    },
  ];

  const useCases = [
    {
      emoji: "🎂",
      title: "Birthday Parties",
      description: "Let guests choose what they want to eat at your party",
    },
    {
      emoji: "💒",
      title: "Weddings",
      description: "Collect meal preferences from all attendees",
    },
    {
      emoji: "👨‍👩‍👧‍👦",
      title: "Family Gatherings",
      description: "Know what everyone wants before cooking",
    },
    {
      emoji: "🏠",
      title: "Home Hosting",
      description: "Perfect for dinner parties and get-togethers",
    },
    {
      emoji: "🎉",
      title: "Events",
      description: "Manage food preferences for your events",
    },
    {
      emoji: "🍽️",
      title: "Restaurants",
      description: "Guests can pre-order or indicate preferences",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Navigation - Modern & Sleek */}
      <nav className="bg-white/80 backdrop-blur-lg shadow-lg sticky top-0 z-50 border-b border-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => window.scrollTo(0, 0)}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
                <span className="text-2xl">🍽️</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                GuestMenu
              </h1>
            </div>
            <div className="hidden md:flex items-center gap-2 bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-2 rounded-full border border-indigo-200">
              <svg
                className="w-4 h-4 text-indigo-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-indigo-700 text-sm font-medium">
                Sign in from your menu link
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Stunning Gradient */}
      <section className="relative overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-1/2 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white py-20 sm:py-28 px-4">
          <div className="max-w-7xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium">
                Now Live & Free Forever
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
              Smart Menu Management
              <br />
              <span className="bg-gradient-to-r from-yellow-200 via-pink-200 to-blue-200 bg-clip-text text-transparent">
                for Your Guests
              </span>
            </h2>

            <p className="text-lg sm:text-xl md:text-2xl mb-4 opacity-95 max-w-3xl mx-auto font-medium">
              Stop guessing what your guests want to eat.
              <span className="text-yellow-200"> Create a menu</span>,
              <span className="text-pink-200"> share a link</span>, and
              <span className="text-blue-200"> let them order</span>!
            </p>

            <p className="text-base sm:text-lg mb-10 opacity-90 max-w-2xl mx-auto">
              Your guests sign in directly from your business menu link
              <br className="hidden sm:block" />
              <span className="font-bold text-yellow-200">
                abhi.guestmenu.com
              </span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="#how-it-works"
                className="group relative bg-white text-indigo-600 hover:bg-gray-50 font-bold py-4 px-8 rounded-2xl transition-all duration-200 inline-flex items-center gap-2 shadow-2xl hover:shadow-3xl transform hover:scale-105"
              >
                <span>Learn How It Works</span>
                <svg
                  className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </a>
              <a
                href="#perfect-for"
                className="group border-2 border-white text-white hover:bg-white hover:text-indigo-600 font-bold py-4 px-8 rounded-2xl transition-all duration-200 inline-flex items-center gap-2 backdrop-blur-sm transform hover:scale-105"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path
                    fillRule="evenodd"
                    d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>See Use Cases</span>
              </a>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
                <div className="text-3xl sm:text-4xl font-bold mb-1">100%</div>
                <div className="text-sm sm:text-base opacity-90">
                  Free Forever
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
                <div className="text-3xl sm:text-4xl font-bold mb-1">∞</div>
                <div className="text-sm sm:text-base opacity-90">
                  Unlimited Menus
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
                <div className="text-3xl sm:text-4xl font-bold mb-1">⚡</div>
                <div className="text-sm sm:text-base opacity-90">
                  Instant Setup
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features - Rich Cards with Gradients */}
      <section className="py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl sm:text-5xl font-extrabold mb-4">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Powerful Features
              </span>
            </h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Everything you need to manage guest menus and collect preferences
              effortlessly
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const gradients = [
                "from-blue-500 to-cyan-500",
                "from-purple-500 to-pink-500",
                "from-orange-500 to-red-500",
                "from-green-500 to-emerald-500",
              ];
              return (
                <div
                  key={index}
                  className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 text-center border border-gray-100 hover:border-transparent hover:-translate-y-2"
                >
                  {/* Gradient overlay on hover */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${gradients[index]} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity`}
                  ></div>

                  <div className="relative">
                    <div
                      className={`inline-flex w-16 h-16 items-center justify-center rounded-2xl bg-gradient-to-br ${gradients[index]} mb-4 transform group-hover:scale-110 transition-transform shadow-lg`}
                    >
                      <span className="text-4xl filter drop-shadow-lg">
                        {feature.icon}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                      {feature.title}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works - Modern Timeline */}
      <section
        id="how-it-works"
        className="py-20 px-4 bg-gradient-to-br from-gray-50 to-indigo-50"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl sm:text-5xl font-extrabold mb-4">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                How It Works
              </span>
            </h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              5 simple steps to start collecting guest preferences like a pro
            </p>
          </div>

          <div className="space-y-8">
            {steps.map((step, index) => {
              const colors = [
                {
                  bg: "from-blue-500 to-cyan-500",
                  text: "text-blue-600",
                  border: "border-blue-200",
                  bgLight: "bg-blue-50",
                },
                {
                  bg: "from-purple-500 to-pink-500",
                  text: "text-purple-600",
                  border: "border-purple-200",
                  bgLight: "bg-purple-50",
                },
                {
                  bg: "from-orange-500 to-red-500",
                  text: "text-orange-600",
                  border: "border-orange-200",
                  bgLight: "bg-orange-50",
                },
                {
                  bg: "from-green-500 to-emerald-500",
                  text: "text-green-600",
                  border: "border-green-200",
                  bgLight: "bg-green-50",
                },
                {
                  bg: "from-pink-500 to-rose-500",
                  text: "text-pink-600",
                  border: "border-pink-200",
                  bgLight: "bg-pink-50",
                },
              ];
              const color = colors[index];

              return (
                <div key={index} className="flex gap-6 sm:gap-8">
                  {/* Step Number */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${color.bg} text-white flex items-center justify-center font-bold text-xl sm:text-2xl shadow-xl transform hover:scale-110 transition-transform`}
                    >
                      {step.number}
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`w-1 flex-1 min-h-[60px] bg-gradient-to-b ${color.bg} opacity-30 mt-3 rounded-full`}
                      ></div>
                    )}
                  </div>

                  {/* Step Content */}
                  <div className="pb-8 flex-grow">
                    <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 sm:p-8 border-l-4 border-transparent hover:border-l-4 hover:${color.border}">
                      <h4
                        className={`text-2xl sm:text-3xl font-bold mb-3 ${color.text}`}
                      >
                        {step.title}
                      </h4>
                      <p className="text-gray-600 mb-6 text-lg">
                        {step.description}
                      </p>
                      <ul className="space-y-3">
                        {step.details.map((detail, i) => (
                          <li
                            key={i}
                            className={`flex items-start gap-3 text-gray-700 ${color.bgLight} p-3 rounded-lg`}
                          >
                            <span className="text-green-500 font-bold flex-shrink-0 text-xl">
                              ✓
                            </span>
                            <span className="font-medium">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Use Cases - Colorful Cards */}
      <section id="perfect-for" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl sm:text-5xl font-extrabold mb-4">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Perfect For
              </span>
            </h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Whatever the occasion, GuestMenu makes planning effortless
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map((useCase, index) => {
              const gradients = [
                "from-pink-400 via-rose-400 to-red-400",
                "from-purple-400 via-pink-400 to-rose-400",
                "from-blue-400 via-indigo-400 to-purple-400",
                "from-green-400 via-emerald-400 to-teal-400",
                "from-yellow-400 via-orange-400 to-red-400",
                "from-indigo-400 via-purple-400 to-pink-400",
              ];
              return (
                <div
                  key={index}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2"
                >
                  <div
                    className={`h-2 bg-gradient-to-r ${gradients[index]}`}
                  ></div>
                  <div className="p-6">
                    <div className="text-6xl mb-4 transform group-hover:scale-110 group-hover:rotate-6 transition-transform">
                      {useCase.emoji}
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                      {useCase.title}
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      {useCase.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* User Journey - Split View with Rich Colors */}
      <section className="py-20 px-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl sm:text-5xl font-extrabold mb-4">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                The Guest Experience
              </span>
            </h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Simple for you, delightful for your guests
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* You (Host) */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-3xl opacity-20 blur-xl group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 border-2 border-blue-100">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
                    👤
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                      You (Host)
                    </h4>
                    <p className="text-sm text-gray-600">
                      Manage everything effortlessly
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  {[
                    {
                      title: "Create a Menu",
                      desc: "Add your dishes and quantities",
                      icon: "📝",
                    },
                    {
                      title: "Share Link",
                      desc: "Send to guests via message/email",
                      icon: "🔗",
                    },
                    {
                      title: "Collect Responses",
                      desc: "See selections in real-time",
                      icon: "📊",
                    },
                    {
                      title: "Plan & Prepare",
                      desc: "Know exactly what to cook",
                      icon: "👨‍🍳",
                    },
                  ].map((step, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-4 bg-blue-50 p-4 rounded-xl hover:bg-blue-100 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white flex items-center justify-center flex-shrink-0 font-bold shadow-md">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{step.icon}</span>
                          <p className="font-bold text-gray-900">
                            {step.title}
                          </p>
                        </div>
                        <p className="text-sm text-gray-600">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Your Guests */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-400 rounded-3xl opacity-20 blur-xl group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 border-2 border-purple-100">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
                    👥
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Your Guests
                    </h4>
                    <p className="text-sm text-gray-600">
                      Simple and intuitive
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  {[
                    {
                      title: "Open Menu Link",
                      desc: "No login required",
                      icon: "🌐",
                    },
                    {
                      title: "Browse Options",
                      desc: "See all available dishes",
                      icon: "👀",
                    },
                    {
                      title: "Select & Submit",
                      desc: "Choose what they want",
                      icon: "✅",
                    },
                    {
                      title: "Get Confirmation",
                      desc: "Know their choice was received",
                      icon: "✨",
                    },
                  ].map((step, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-4 bg-purple-50 p-4 rounded-xl hover:bg-purple-100 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center flex-shrink-0 font-bold shadow-md">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{step.icon}</span>
                          <p className="font-bold text-gray-900">
                            {step.title}
                          </p>
                        </div>
                        <p className="text-sm text-gray-600">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Frequently Asked Questions
          </h3>

          <div className="space-y-6">
            {[
              {
                q: "Is GuestMenu free to use?",
                a: "Yes! GuestMenu is completely free to use. Create unlimited menus, add unlimited guests, and collect unlimited submissions.",
              },
              {
                q: "Do guests need to create an account?",
                a: "No! Guests simply click your link and submit their preferences. No login or account required.",
              },
              {
                q: "How do I share my menu?",
                a: "After creating a menu, you get a unique link (e.g., abhi.guestmenu.com). Share this link with guests via text, email, or social media.",
              },
              {
                q: "Can I customize the menu appearance?",
                a: "Yes! You can customize colors, fonts, logos, and more to match your style and branding.",
              },
              {
                q: "What information can I collect from guests?",
                a: "You can collect their name, email, phone number, their menu selections, and special requests or notes.",
              },
              {
                q: "Can I export the data?",
                a: "Yes! Export all submissions to CSV or PDF for easy analysis and planning.",
              },
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  {faq.q}
                </h4>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Eye-catching */}
      <section className="relative overflow-hidden py-20 px-4">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 via-purple-400/30 to-pink-400/30 animate-pulse"></div>

        <div className="relative max-w-5xl mx-auto text-center text-white">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
            <span className="text-sm font-medium">
              Limited Time: Free Forever!
            </span>
          </div>

          <h3 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            Ready to Simplify
            <br />
            <span className="bg-gradient-to-r from-yellow-200 via-pink-200 to-blue-200 bg-clip-text text-transparent">
              Guest Planning?
            </span>
          </h3>

          <p className="text-xl sm:text-2xl mb-4 opacity-95 max-w-3xl mx-auto">
            Create your free account and start sharing your menu with guests
            today!
          </p>

          <p className="text-base sm:text-lg mb-10 opacity-90">
            Guests will sign in directly from your unique menu link to place
            their orders.
            <br className="hidden sm:block" />
            <span className="font-bold text-yellow-200">
              No credit card required. Forever free.
            </span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="#how-it-works"
              className="group relative bg-white text-indigo-600 hover:bg-gray-50 font-bold py-4 px-10 rounded-2xl transition-all duration-200 inline-flex items-center gap-2 shadow-2xl hover:shadow-3xl transform hover:scale-105 text-lg"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                  fillRule="evenodd"
                  clipRule="evenodd"
                />
              </svg>
              <span>Get Started Free</span>
              <span className="absolute -top-2 -right-2 bg-yellow-400 text-indigo-900 text-xs font-bold px-2 py-1 rounded-full animate-bounce">
                FREE
              </span>
            </a>
            <a
              href="#perfect-for"
              className="border-2 border-white text-white hover:bg-white hover:text-indigo-600 font-bold py-4 px-10 rounded-2xl transition-all duration-200 inline-flex items-center gap-2 backdrop-blur-sm transform hover:scale-105 text-lg"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Learn More</span>
            </a>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-6 text-sm opacity-90">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-green-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>No Credit Card</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-green-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Unlimited Menus</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-green-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Free Forever</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl">🍽️</span>
                <h4 className="text-lg font-bold text-white">GuestMenu</h4>
              </div>
              <p className="text-sm">
                Smart menu management for hosts and event planners.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <button
                    onClick={() => navigate("/login")}
                    className="hover:text-white transition"
                  >
                    Login
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/signup")}
                    className="hover:text-white transition"
                  >
                    Sign Up
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <button
                    onClick={() => {}}
                    className="hover:text-white transition bg-none border-none text-left cursor-pointer p-0"
                  >
                    Help Center
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {}}
                    className="hover:text-white transition bg-none border-none text-left cursor-pointer p-0"
                  >
                    Contact Us
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2024 GuestMenu. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
