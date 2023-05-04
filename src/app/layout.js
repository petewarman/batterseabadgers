export const metadata = {
  title: "Battersea Badgers Cricket Club",
  description:
    "Battersea Badgers Cricket Club is a social team based in Wandsworth in South West London.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
