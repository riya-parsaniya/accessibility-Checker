import './globals.css';

export const metadata = {
  title: 'Accessibility Checker — WCAG 2.1 Compliance Auditor',
  description:
    'Free automated WCAG 2.0/2.1 accessibility auditing tool. Scan any website for accessibility violations instantly using axe-core and get actionable fix guidance.',
  keywords: [
    'accessibility checker',
    'WCAG 2.1',
    'axe-core',
    'accessibility audit',
    'ADA compliance',
    'screen reader',
    'color contrast',
    'ARIA',
  ],
  authors: [{ name: 'Accessibility Checker' }],
  openGraph: {
    title: 'Accessibility Checker — WCAG 2.1 Compliance Auditor',
    description: 'Scan any website for accessibility violations instantly.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0a0e1a" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>♿</text></svg>" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
