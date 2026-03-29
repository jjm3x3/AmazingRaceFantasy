import Link from "next/link";
import IPage from "./models/IPage";
import ISubpage from "./models/ISubpage";
import { getShowPages } from "@/app/utils/pages";
import "./styles/homepage.scss";

export default async function Home() {
    const pages = await getShowPages();
    return (
        <>
            <div className="site-notice">
                <p>
                    League Submission forms for Survivor 50 have been sent out. If you would like to participate and didn't get one, email <Link className="standard-link" href="mailto:xfactorleaguesite@gmail.com">xfactorleaguesite@gmail.com</Link> and we will see what we can do.
                </p>
            </div>
            {pages.map((p: IPage) => { 
                const keyName = p.name.toLowerCase().replaceAll(" ", "-");
                return (<div key={`links-section-${keyName}`}>
                    <div className="flex flex-wrap items-baseline gap-3 mb-2">
                        <p className="league-link-heading m-0">Links For { p.name } League</p>
                        <Link className="text-sm text-gray-600 hover:text-gray-800" href={p.detailsPath}>League config</Link>
                    </div>
                    <div className="md:flex md:flex-row">{
                        p.subpages.map((pSub: ISubpage, index: number) => (
                            <p className="standard-link-container md:basis-1/3" key={`${pSub.name.toLowerCase().replaceAll(" ", "-")}-subpage-${index}`}>
                                <Link className="standard-link" key={`links-section-${keyName}-link-${pSub.name.toLowerCase().replaceAll(" ", "-")}`} href={pSub.path}>{ pSub.name}</Link>
                            </p>
                        ))
                    }</div>
                </div>);
            })}
        </>
    );
}
