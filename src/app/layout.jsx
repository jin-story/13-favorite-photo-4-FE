import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";
import Gnb from "@/components/common/Gnb";

const notoSansKR = localFont({
  src: [
    { path: "../assets/fonts/NotoSansKR-Light.ttf", weight: "300" },
    { path: "../assets/fonts/NotoSansKR-Regular.ttf", weight: "400" },
    { path: "../assets/fonts/NotoSansKR-Bold.ttf", weight: "700" },
  ],
  variable: "--font-noto-sans-kr",
});

const baskinRobbins = localFont({
  src: "../assets/fonts/BaskinRobbinsBold.otf",
  weight: "700",
  variable: "--font-baskin-robbins",
});

export const metadata = {
  title: "최애의 포토",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="ko"
      className={`${notoSansKR.variable} ${baskinRobbins.variable}`}
    >
      <body>
        <Gnb />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
