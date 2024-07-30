import { Inter } from "next/font/google";
import "./globals.css";
<link href="https://fonts.googleapis.com/css?family=Roboto&display=swap" rel="stylesheet"/>

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: 'Task Planner | Plan Your Day',
  description: 'Organize your daily tasks efficiently with our task planner. Add, manage, and complete tasks to boost your productivity.',
  keywords: 'task planner, todo list, productivity, time management',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="retro">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
