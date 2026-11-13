import Link from "next/link";
import Logo from "./components/logo";

export default function NotFound() {
  return (
    <main className="notfound">
      <Logo />
      <h1>404</h1>
      <p>This page isn’t ready yet.</p>
      <Link className="vz-button" href="/">BACK TO VEZQO <span>↗</span></Link>
    </main>
  );
}
