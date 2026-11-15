import Image from "next/image";
import Link from "next/link";

export default function Brand({
  tone = "dark",
  href = "/",
}: {
  tone?: "light" | "dark";
  href?: string;
}) {
  const color = tone === "light" ? "navy" : "white";
  return (
    <Link href={href} className="brand" aria-label="Lumen Radar home">
      <Image
        className="brand-symbol"
        src={`/brand/symbol-${color}.svg`}
        alt=""
        width={26}
        height={30}
        priority
      />
      <Image
        className="brand-wordmark sidebar-label"
        src={`/brand/wordmark-${color}.svg`}
        alt=""
        width={146}
        height={12}
        priority
      />
    </Link>
  );
}
