import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Малько Ирина Александровна — Центр образования «Приоритет»",
  description: "Ирина Александровна Малько — директор ГБУ ДО ЛО «Центр образования «Приоритет». Контакты и официальные образовательные ресурсы.",
  openGraph: {
    type: "profile",
    title: "Малько Ирина Александровна — директор Центра образования «Приоритет»",
    description: "Контакты Ирины Александровны Малько — директора Центра образования «Приоритет».",
  },
  icons: {
    icon: "/assets/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Малько Ирина Александровна",
    jobTitle: "Директор",
    worksFor: {
      "@type": "Organization",
      name: "ГБУ ДО ЛО «Центр образования «Приоритет»",
      url: "https://prioritet-48.ru/",
    },
    email: "irina.malko@it-cube48.ru",
    telephone: "+7-910-351-60-01",
    sameAs: ["https://vk.ru/id26950968"],
  };

  return (
    <html lang="ru">
      <head>
        <meta name="theme-color" content="#f6f5f1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Golos+Text:wght@400;450;500;550;600;650;700&family=Literata:opsz,wght@7..72,400;7..72,500;7..72,600&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}