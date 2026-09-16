import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import { ThemeProvider } from "@/stores/ThemeProvider";
import "./globals.css";
import { AuthProvider } from "@/stores/AuthProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

const sourceSerif4 = Source_Serif_4({
  variable: "--font-source-serif-4",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Write Tool — Công cụ viết sáng tạo",
  description: "Ứng dụng hỗ trợ viết với giao diện dịu mắt, tối giản kiểu Neumorphism",
};

const themeInitScript = `
  (function() {
    try {
      var raw = localStorage.getItem('write-ui-theme-settings');
      if (raw) {
        var parsed = JSON.parse(raw);
        var root = document.documentElement;
        if (parsed.theme) root.setAttribute('data-theme', parsed.theme);
        if (parsed.fontFamily) root.setAttribute('data-font', parsed.fontFamily);
        if (parsed.fontSize) root.setAttribute('data-font-size', parsed.fontSize);
        if (parsed.contentWidth) root.setAttribute('data-content-width', parsed.contentWidth);
      }
    } catch (e) {}
  })();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      className={`${inter.variable} ${sourceSerif4.variable}`}
      data-theme="giay-moc"
      data-font="serif"
      data-font-size="18"
      data-content-width="740"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
