import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center group transition-all duration-200 hover:opacity-90"
    >
      <Image
        src="https://ik.imagekit.io/ratanofficial/rkdigitalstudio/newLogoRk.png?updatedAt=1762518047314"
        alt="RK Digital Studio Logo"
        width={192}
        height={53}
        priority
      />
    </Link>
  );
}
