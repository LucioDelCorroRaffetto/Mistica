export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-indigo-900 via-purple-800 to-pink-700 text-white py-6 mt-auto shadow-lg">
      <article className="container mx-auto flex flex-col items-center">
        <p className="text-lg font-semibold tracking-wide mb-2">
          &copy; {new Date().getFullYear()} Mistica. Todos los derechos reservados.
        </p>
        <div className="flex gap-4">
          <a
            href="https://github.com/LucioDelCorroRaffetto/Mistica"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-300 transition-colors duration-200"
          >
            GitHub
          </a>
          <a
            href="mailto:contacto@mistica.com"
            className="hover:text-pink-300 transition-colors duration-200"
          >
            Contacto
          </a>
        </div>
      </article>
    </footer>
  );
}