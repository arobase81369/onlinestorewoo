"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Breadcrumbs = () => {
  const pathname = usePathname();
  const parts = pathname.split("/").filter((part) => part);

  return (
    <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
     <ol className="list-none p-0 inline-flex gap-2 items-center">
        <li>
          <Link href="/" className="hover:underline text-gray-700 font-medium">
            Home
          </Link>
        </li>
        {parts.map((part, idx) => {
          const href = "/" + parts.slice(0, idx + 1).join("/");
          const isLast = idx === parts.length - 1;
          const label = decodeURIComponent(part).replace(/-/g, " ");

          return (
            <li key={href} className="flex items-center gap-2">
              <span>/</span>
              {isLast ? (
                <span className="capitalize text-gray-600">{label}</span>
              ) : (
                <Link href={href} className="hover:underline capitalize">
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
