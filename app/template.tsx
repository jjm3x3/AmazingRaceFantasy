import "./globals.scss";
import { getShowPages } from "@/app/utils/pages";
import Navigation from "./components/navigation/navigation";
import { SessionProvider } from "./contexts/session";
import { cookies } from "next/headers";
import SessionContextedLabel from "@/app/components/sessionContextedLabel";
import { decrypt } from "@/app/api/session/session";

export default async function Template({
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

    return (
        <>
            <SessionProvider sessionExpiresAt={sessionExpiresAt}>
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
        </>
    );
}
