export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white text-center p-8">
      <img
        src="/logo.png"
        alt="Capital Area Food Chat Logo"
        style={{ width: "10rem", marginBottom: "1.5rem" }}
      />

      <h1 className="text-3xl font-bold mb-4">
        Get Food Support Near You
      </h1>

      <p className="text-lg text-gray-600 mb-6">
        Chat with our AI helper and find nearby food assistance.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <button className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition">
          Get Started
        </button>
        <button className="border border-green-600 text-green-600 px-6 py-2 rounded-full hover:bg-green-100 transition">
          Learn More
        </button>
      </div>
    </main>
  );
}
