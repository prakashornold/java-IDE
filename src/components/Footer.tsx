export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[#282934] bg-[#1a1b22] py-2 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-[11px] text-[#585d6a] font-medium tracking-tight">
          &copy; {currentYear} JavaCodingPractice.com. All rights reserved. | Developed By Om Prakash Peddamadthala
        </p>
      </div>
    </footer>
  );
}
