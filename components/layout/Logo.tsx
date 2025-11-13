import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center group transition-all duration-200 hover:opacity-90"
    >
      <Image
        src="https://ik.imagekit.io/ratanofficial/rkdigitalstudio/newLogoRk.png?updatedAt=1763020874233"
        alt="RK Digital Studio Logo"
        width={172}
        height={45}
        priority
        className="w-auto h-auto"
      />
    </Link>
  );
}
