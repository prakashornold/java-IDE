export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[#323232] bg-[#1e1e1e] py-2 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-xs text-gray-400">
          © {currentYear} JavaCodingPractice.com. All rights reserved. | Developed By Om Prakash Peddamadthala
        </p>
      </div>
    </footer>
  );
}
