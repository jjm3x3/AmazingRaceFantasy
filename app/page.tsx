import Link from "next/link";
import IPage from "./models/IPage";
import ISubpage from "./models/ISubpage";
import { getPages, getSiteNotice } from "@/app/utils/pages";
import "./styles/homepage.scss";

export default async function Home() {
    const pages = await getPages();
    const siteNotice = getSiteNotice(pages);
    return (
        <>
            {siteNotice}
            {pages.map((p: IPage) => { 
                const keyName = p.name.toLowerCase().replaceAll(" ", "-");
                return (<div key={`links-section-${keyName}`}>
                    <p className="league-link-heading" >Links For { p.name } League</p>
                    <div className="md:flex md:flex-row">{
                        p.subpages.map((pSub: ISubpage, index) => (
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
