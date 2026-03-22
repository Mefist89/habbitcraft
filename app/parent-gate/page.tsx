import Link from "next/link";

export default function ParentGatePage() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-bg-start to-bg-end px-6 py-8">
      {/* Top Bar with Back Button */}
      <div className="w-full flex justify-start mb-8">
        <Link
          href="/disclaimer"
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/50 backdrop-blur-md shadow-soft hover:bg-white/80 transition-colors"
        >
          <span className="material-symbols-outlined text-on-surface-variant">
            arrow_back
          </span>
        </Link>
      </div>

      <main className="flex-1 w-full max-w-md flex flex-col items-center justify-center text-center mt-[-40px]">
        {/* Magic Lock Icon */}
        <div className="relative w-28 h-28 mb-8 floating-anim">
          <div className="absolute inset-0 bg-secondary/20 puf-shape blur-xl" />
          <div className="w-28 h-28 bg-gradient-to-br from-secondary-light to-secondary puf-shape shadow-floating flex items-center justify-center border-4 border-white relative">
            <span className="material-symbols-outlined text-white text-5xl">
              family_restroom
            </span>
          </div>
        </div>

        <h1 className="font-headline font-bold text-3xl text-secondary tracking-tight mb-4">
          Parent&apos;s Turn!
        </h1>
        
        <p className="font-body text-base text-on-surface-variant leading-relaxed mb-10 px-4">
          To continue your adventure and save your progress, a parent needs to log in or create an account for you.
        </p>

        {/* Action Buttons */}
        <div className="w-full space-y-4">
          <Link
            href="/register"
            className="block w-full py-4 bg-gradient-to-r from-secondary to-secondary-light text-white font-headline font-bold text-lg rounded-2xl shadow-vibrant hover:shadow-floating hover:scale-[1.02] active:scale-95 transition-all text-center"
          >
            CREATE ACCOUNT
          </Link>
          
          <Link
            href="/login"
            className="block w-full py-4 bg-white text-secondary font-headline font-bold text-lg rounded-2xl shadow-soft hover:shadow-floating hover:scale-[1.02] active:scale-95 transition-all outline outline-2 outline-secondary/20 text-center"
          >
            LOG IN
          </Link>
        </div>
      </main>
    </div>
  );
}
