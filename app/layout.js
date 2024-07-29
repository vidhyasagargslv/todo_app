import { Inter } from "next/font/google";
import "./globals.css";
<link href="https://fonts.googleapis.com/css?family=Roboto&display=swap" rel="stylesheet"/>

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "TodoApp",
  description: "Build a todo app for the assignment purpose",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="retro">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
