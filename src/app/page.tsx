import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-teal-100 via-blue-100 to-white px-4 py-8">
      <header className="w-full max-w-2xl flex flex-col items-center gap-6 mb-12 mt-8">
        <Image
          src="/favicon.ico"
          alt="Tools You Will Love Logo"
          width={64}
          height={64}
          className="rounded-2xl shadow-lg"
          priority
        />
        <h1 className="text-4xl sm:text-5xl font-extrabold text-teal-700 drop-shadow text-center tracking-tight">
          Tools You Will Love
        </h1>
        <p className="text-lg sm:text-xl text-blue-700 font-medium text-center max-w-xl">
          It's a toolbox you'll love, and whenever you open your laptop to get ready for work,<br className="hidden sm:inline" />
          you'll always be reminded of <span className="font-bold text-teal-600">toolsyouwilllove.com</span>
        </p>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center w-full">
        <div className="bg-white/80 rounded-2xl shadow-xl p-8 w-full max-w-lg flex flex-col items-center gap-6 border border-teal-100">
          <h2 className="text-2xl font-semibold text-teal-800 mb-2">欢迎来到你的专属工具箱！</h2>
          <p className="text-base text-gray-600 text-center">
            这里将会收录你工作和生活中最实用、最有趣的在线工具。<br />
            让每一次打开电脑都充满灵感与高效。
          </p>
        </div>
      </main>
      <footer className="w-full max-w-2xl mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-400 text-sm pb-2 pt-8 border-t border-teal-100">
        <span>© {new Date().getFullYear()} Tools You Will Love</span>
        <span>Made with ❤️ by fiendo</span>
      </footer>
    </div>
  );
}
