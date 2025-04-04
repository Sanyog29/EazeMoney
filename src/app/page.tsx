import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-400">EazeMoney</div>
        <nav className="space-x-4">
          <Link href="/login" className="text-gray-300 hover:text-white transition">
            Login
          </Link>
          <Link
            href="/register"
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white transition"
          >
            Get Started
          </Link>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Banking Made <span className="text-blue-400">Simple</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mb-10">
            Experience hassle-free banking with EazeMoney. Manage your finances, make transfers, and track your spending all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/register"
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-md text-white font-medium transition"
            >
              Open an Account
            </Link>
            <Link
              href="/login"
              className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-md text-white font-medium transition"
            >
              Sign In
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-gray-800 py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose EazeMoney?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-700 p-6 rounded-lg">
                <div className="text-blue-400 text-4xl mb-4">💰</div>
                <h3 className="text-xl font-semibold mb-2">Easy Transfers</h3>
                <p className="text-gray-300">
                  Send money to anyone, anytime with just a few clicks. No hidden fees or complicated processes.
                </p>
              </div>
              
              <div className="bg-gray-700 p-6 rounded-lg">
                <div className="text-blue-400 text-4xl mb-4">📊</div>
                <h3 className="text-xl font-semibold mb-2">Track Spending</h3>
                <p className="text-gray-300">
                  Keep track of all your transactions with our intuitive dashboard and detailed history.
                </p>
              </div>
              
              <div className="bg-gray-700 p-6 rounded-lg">
                <div className="text-blue-400 text-4xl mb-4">🔒</div>
                <h3 className="text-xl font-semibold mb-2">Secure Banking</h3>
                <p className="text-gray-300">
                  Your security is our priority. Rest easy knowing your data and money are protected.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Join thousands of satisfied customers who have made the switch to EazeMoney.
          </p>
          <Link
            href="/register"
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-md text-white font-medium transition"
          >
            Create Your Account
          </Link>
        </section>
      </main>

      <footer className="bg-gray-800 border-t border-gray-700 py-8">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>© {new Date().getFullYear()} EazeMoney.Created & Hosted by Sanyog Tripathi</p>
          <p className="mt-2 text-sm">This is a demo application. Real Web Bank Interface Simulation.</p>
        </div>
      </footer>
    </div>
  );
}