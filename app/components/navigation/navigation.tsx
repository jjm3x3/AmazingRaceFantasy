"use client";
import styles from "./navigation.module.scss";
import Link from "next/link";
import IPage from "@/app/models/IPage";
import ISubpage from "@/app/models/ISubpage";
import NavigationItem from "./navigation-item";
import GoogleLoginButton from "./google-login-btn";
import { useContext } from "react";
import { SessionContext } from "@/app/contexts/session";
import LogoutButton from "@/app/components/navigation/logoutButton"

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
    const { isLoggedIn } = useContext(SessionContext);

    return (<nav id={styles["navigation"]} data-testid="navigation">
        <NavigationItem inputAttr={rootNavInputAttr} 
            labelAttr={rootNavLabelAttr} 
            listAttr={rootNavListAttr} 
            navigationClose={isLoggedIn}
            childElements={
                <>{pages.map((page: IPage) => {
                    const keyName = page.name.toLowerCase().replaceAll(" ", "-");
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
                        <NavigationItem inputAttr={subpageInputAttr} 
                            labelAttr={subpageLabelAttr} 
                            listAttr={subpageListAttr} 
                            navigationClose={isLoggedIn}
                            childElements={page.subpages.map((subpage: ISubpage) => {
                                const subpageKeyName = subpage.name.toLowerCase().replaceAll(" ", "-");
                                return <li key={`nav-toplevellink-${keyName}-sublink-${subpageKeyName}`}>
                                    <Link href={subpage.path} className={styles["sub-level-link"]}>{subpage.name}</Link>
                                </li>;
                            })} />
                    </li>);
                })}
                { !isLoggedIn ?
                    <li className={styles["top-level-link"]} data-testid="google-login-btn" key={"nav-toplevellink-login"}><GoogleLoginButton/></li>
                    : <li className={styles["top-level-link"]} key={"nav-toplevellink-logout"}><LogoutButton/></li>}
                </>} />
    </nav>);
}
