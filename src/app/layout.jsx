import "./globals.css";

export const metadata = {
  title: "RPG Portfolio",
  description: "A pixel-art RPG portfolio experience",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-black">{children}</body>
    </html>
  );
}
