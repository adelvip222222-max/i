export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4 text-center">
        <p className="text-gray-400">
          © {currentYear} منصة 4IT. جميع الحقوق محفوظة.
        </p>
      </div>
    </footer>
  );
}
