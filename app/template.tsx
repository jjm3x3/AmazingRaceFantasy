import "./globals.scss";
import { getShowPages } from "@/app/utils/pages";
import Navigation from "./components/navigation/navigation";
import { SessionProvider } from "./contexts/session";
import { cookies } from "next/headers";

export default async function Template({
    children
}: {
  children: React.ReactNode
}) {
    const pages = await getShowPages();
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("session");
    const hasSessionCookie = !!sessionCookie;

    return (
        <>
            <SessionProvider hasSessionCookie={hasSessionCookie} userName={""}>
                <header>
                    <p>
                        <a href="/" title="Link that takes user to homepage. " className="page-title">X Factor Fantasy</a>
                    </p>
                    {pages.length > 0 && <Navigation pages={pages} />}
                </header>
                <main>
                    {children}
                </main>
            </SessionProvider>
        </>
    );
}
