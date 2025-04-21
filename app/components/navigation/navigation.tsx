"use client";
import styles from "./navigation.module.scss";
import Link from "next/link";
import IPage from "@/app/models/IPage";
import ISubpage from "@/app/models/ISubpage";
import NavigationItem from "./navigation-item";
import Script from "next/script";

export default function Navigation({ pages }: {
    pages: IPage[]
}) { 
    const rootNavInputAttr = {
        id: "hamburger-nav-toggle",
        classes: styles["nav-toggle"]
    };
    const rootNavLabelAttr = {
        id: styles["nav-toggle-btn"],
        classes: "",
        aria: {
            controls: "navigation-menu"
        },
        testId: "hamburger-nav-btn",
        content: <span id={styles["hamburger-nav-icon"]}/>
    };
    const rootNavListAttr = {
        id: styles["navigation-menu"],
        testId: "navigation-menu",
        classes: ""
    };
    return (<nav id={styles["navigation"]} data-testid="navigation">
        <Script src="https://accounts.google.com/gsi/client" />
        <NavigationItem inputAttr={rootNavInputAttr} labelAttr={rootNavLabelAttr} listAttr={rootNavListAttr} hasSubpages={ pages.length > 0} childElements={<>{
            pages.map((page: IPage) => {
                const keyName = page.name.toLowerCase().replaceAll(" ", "-");
                const hasSubpages = page.subpages && page.subpages.length > 0;
                const subpageInputAttr = {
                    id: `subpage-${keyName}-input`,
                    classes: styles["nav-subpages-toggle"],
                };
                const subpageLabelAttr = {
                    id: `subpage-${keyName}-label`,
                    content: <p className={`${styles["top-level-link"]} ${styles["nav-dropdown"]}`}>{page.name}</p>,
                    classes: styles["nav-subpages-menu"],
                    aria: {
                        controls: `subpage-${keyName}-dropdown`
                    },
                    testId: `subpage-${keyName}-label`
                };
                const subpageListAttr = {
                    id: `subpage-${keyName}-dropdown`,
                    testId: `subpage-${keyName}-dropdown`,
                    classes: styles["nav-subpages-list"]
                };
                return (<li key={`nav-toplevellink-${keyName}`}>
                    <NavigationItem hasSubpages={hasSubpages }  inputAttr={subpageInputAttr } labelAttr={subpageLabelAttr } listAttr={ subpageListAttr} childElements={page.subpages.map((subpage: ISubpage) => {
                        const subpageKeyName = subpage.name.toLowerCase().replaceAll(" ", "-");
                        return <li key={`nav-toplevellink-${keyName}-sublink-${subpageKeyName}`}>
                            <Link href={subpage.path} className={styles["sub-level-link"]}>{subpage.name}</Link>
                        </li>;
                    })} />
                </li>);
            })}
        <li key={"nav-toplevellink-login"}>
            <div id="g_id_onload"
                data-client_id="339861119825-23nsue74j0td0acsiecpne0a8jejon8s.apps.googleusercontent.com"
                data-context="signin"
                data-ux_mode="popup"
                data-callback={(res)=> {
                    console.log(res);
                }}
                data-auto_prompt="false">
            </div>

            <div className="g_id_signin"
                data-type="standard"
                data-shape="rectangular"
                data-theme="outline"
                data-text="signin_with"
                data-size="medium"
                data-logo_alignment="left">
            </div>
        </li>
        </>} />
    </nav>);
}
