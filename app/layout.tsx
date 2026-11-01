import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";
import { getShowPages } from "@/app/utils/pages";
import Navigation from "./components/navigation/navigation";
import { SessionProvider } from "./contexts/session";
import { cookies } from "next/headers";
import SessionContextedLabel from "@/app/components/sessionContextedLabel";
import { decrypt } from "@/app/api/session/session";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "X Factor League",
    description: "A website for all of your fantasy league needs"
};

// SessionProvider lives in the layout rather than a template so it is not remounted on navigation,
// which would throw away the client side session state set by login and create account
export default async function RootLayout({
    children
}: {
  children: React.ReactNode
}) {
    const pages = await getShowPages();
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("session");
    // an expired or tampered token fails verification, so the user is treated as logged out
    const decryptedSession = sessionCookie ? await decrypt(sessionCookie.value) : undefined;
    const sessionExpiresAt = decryptedSession && "exp" in decryptedSession && typeof decryptedSession.exp === "number" ? decryptedSession.exp : null;
    const userId = sessionExpiresAt !== null && decryptedSession && "sub" in decryptedSession && typeof decryptedSession.sub === "string" ? decryptedSession.sub : null;

    return (
        <html className={inter.className}>
            <body>
                <SessionProvider sessionExpiresAt={sessionExpiresAt} userId={userId}>
                    <header>
                        <p>
                            <a href="/" title="Link that takes user to homepage. " className="page-title">X Factor Fantasy</a>
                        </p>
                        <SessionContextedLabel />
                        {pages.length > 0 && <Navigation pages={pages} />}
                    </header>
                    <main>
                        {children}
                    </main>
                </SessionProvider>
            </body>
        </html>
    );
}
