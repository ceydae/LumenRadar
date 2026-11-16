import Image from "next/image";
import Link from "next/link";

export default function Brand({
  tone = "auto",
  href = "/",
}: {
  tone?: "light" | "dark" | "auto";
  href?: string;
}) {
  const color = tone === "dark" ? "white" : "navy";
  return (
    <Link href={href} className="brand" aria-label="Lumen Radar home">
      <Image
        className={`brand-symbol${tone === "auto" ? " theme-light" : ""}`}
        src={`/brand/symbol-${color}.svg`}
        alt=""
        width={559}
        height={641}
        priority
      />
      {tone === "auto" && (
        <Image
          className="brand-symbol theme-dark"
          src="/brand/symbol-white.svg"
          alt=""
          width={559}
          height={641}
          priority
        />
      )}
      <span
        className="brand-wordmark-frame sidebar-label"
        data-sidebar="group-label"
      >
        <Image
          className={`brand-wordmark${tone === "auto" ? " theme-light" : ""}`}
          src={`/brand/wordmark-${color}.svg`}
          alt=""
          width={1743}
          height={143}
          priority
        />
        {tone === "auto" && (
          <Image
            className="brand-wordmark theme-dark"
            src="/brand/wordmark-white.svg"
            alt=""
            width={1743}
            height={143}
            priority
          />
        )}
      </span>
    </Link>
  );
}
