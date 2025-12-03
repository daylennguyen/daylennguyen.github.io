import ChickenCanvas from "./components/ChickenCanvas";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="flex min-h-screen w-full max-w-6xl flex-col items-center justify-center py-32 px-16 bg-transparent relative z-10">
        <div className="flex flex-col items-center gap-16 text-center">
          <h1 className="text-8xl tracking-tight text-black dark:text-zinc-50">
            Daylen Nguyen
          </h1>
          <p className="max-w-3xl text-3xl leading-relaxed text-zinc-600 dark:text-zinc-400">
            Welcome to my small slice of the internet 🧙🏻‍♂️
          </p>
          <div className="flex flex-col gap-8 text-2xl sm:flex-row">
            <a
              className="flex h-24 w-full items-center justify-center gap-4 rounded-full bg-black px-12 text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 sm:w-auto"
              href="https://github.com/daylennguyen"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>
      </main>
      <ChickenCanvas />
    </div>
  );
}

