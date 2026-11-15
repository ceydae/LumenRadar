import Image from "next/image";

export default function SessionLoading() {
  return (
    <div className="session-loading" role="status">
      <Image
        src="/brand/symbol-navy.svg"
        alt=""
        width={24}
        height={28}
        priority
      />
      <p>Opening your workspace…</p>
    </div>
  );
}
