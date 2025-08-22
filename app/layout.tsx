import type { Metadata } from "next";
import "./../styles/globals.css";

export const metadata: Metadata = {
  title: "StatLynk HR & Payroll",
  description: "All-in-one Core HR, Payroll, Attendance, Performance",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
