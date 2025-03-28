import "./globals.scss";
import { getPages } from "@/app/utils/pages";
import Navigation from "./components/navigation/navigation";

export default async function Template({
    children
}: {
  children: React.ReactNode
}) {
    const pages = await getPages();
    return (
        <>
            <header>
                <p>
                    <a href="/" title="Link that takes user to homepage. " className="page-title">X Factor Fantasy</a>
                </p>
                {pages.length > 0 && <Navigation pages={pages} />}
            </header>
            <main>
                {children}
            </main>
        </>
    );
}
