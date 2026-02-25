import Link from "next/link";

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui", margin: 0 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
          <p style={{ fontSize: "4rem", fontWeight: "bold", color: "#999", margin: 0 }}>404</p>
          <h1 style={{ marginTop: "1rem", fontSize: "1.5rem" }}>Page not found</h1>
          <Link href="/" style={{ marginTop: "1rem", color: "#0ea5e9" }}>Back to Home</Link>
        </div>
      </body>
    </html>
  );
}
