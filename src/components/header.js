import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./Header.module.css";

export default function Header() {
  const router = useRouter();

  const isActive = (path) => router.pathname === path;

  return (
    <header className={styles.header}>
      <h2 className={styles.title}>🥗 Open Food Facts</h2>

      <nav className={styles.nav}>
        <Link href="/" className={isActive("/") ? styles.active : ""}>
          Home
        </Link>
        <Link
          href="/saved-products"
          className={isActive("/saved-products") ? styles.active : ""}
        >
          Saved Products
        </Link>
        <Link
          href="/expiring-products"
          className={isActive("/expiring-products") ? styles.active : ""}
        >
          Expiring Soon
        </Link>
      </nav>
    </header>
  );
}
