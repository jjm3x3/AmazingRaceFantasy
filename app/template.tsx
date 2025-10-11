import "./globals.scss";
import Script from "next/script";
import { getShowPages } from "@/app/utils/pages";
import Navigation from "./components/navigation/navigation";
import { SessionProvider } from "./contexts/session";
import { cookies } from "next/headers";
import SessionContextedLabel from "@/app/components/sessionContextedLabel";

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
            <SessionProvider hasSessionCookie={hasSessionCookie}>
                <header>
                    <p>
                        <a href="/" title="Link that takes user to homepage. " className="page-title">X Factor Fantasy</a>
                    </p>
                    <SessionContextedLabel />
                    {pages.length > 0 && <Navigation pages={pages} />}
                </header>
                <main>
                    {children}
                    <Script async src="https://accounts.google.com/gsi/client"/>
                </main>
            </SessionProvider>
        </>
    );
}
