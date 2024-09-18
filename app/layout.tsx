import "./globals.css";

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body className="font-inter bg-background text-foreground">
        <div className="font-inter">{children}</div>
        </body>
        </html>
    );
}