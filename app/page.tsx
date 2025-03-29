import Link from "next/link";
import IPage from "./models/IPage";
import ISubpage from "./models/ISubpage";
import { getPages } from "@/app/utils/pages";
import "./styles/homepage.scss";

export default async function Home() {
    const pages = await getPages();

    return (
        <>
            <div className="site-notice">
                <p>
                    The league for The Amazing Race 37 is already underway. Stay tuned to see how you fair. If you would still like to join this or future leagues, feel free to email <Link className="standard-link" href="mailto:xfactorleaguesite@gmail.com">xfactorleaguesite@gmail.com</Link>.
                </p>
                <p>
                    We are aware of an issue effecting the current Amazing Race league. Fix coming soon!
                </p>
            </div>
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
