import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-linear-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-md">
              <span className="font-bold text-black">TOS</span>
            </div>
            <h3 className="text-lg font-semibold">The Online Store</h3>
          </div>
          <p className="text-sm text-zinc-300">Modern products to elevate your lifestyle.</p>
        </div>
        <div></div>
        <div>
          <h4 className="mb-2 font-medium">Navigation</h4>
          <ul className="flex flex-col gap-2 text-sm text-zinc-300">
            <li>
              <Link href="/" className="hover:text-orange-300">
                Home
              </Link>
            </li>
            <li>
              <Link href="/cart" className="hover:text-orange-300">
                Cart
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-orange-300">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-4 text-sm text-zinc-400 flex flex-col sm:flex-row items-center justify-between">
          <span>© {new Date().getFullYear()} The Online Store</span>
        </div>
      </div>
    </footer>
  );
}
