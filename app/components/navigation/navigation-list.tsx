import styles from './navigation.module.scss';
import IPage from "@/app/models/IPage";
import NavigationItem from './navigation-item';
import SubpageList from './subpage-list';

export default function NavigationList({ pages }: { pages: IPage[] }) {
    const rootNavInputAttr = {
        id: "hamburger-nav-toggle",
        classes: styles['nav-toggle']
    };
    const rootNavLabelAttr = {
        id: styles['nav-toggle-btn'],
        classes: '',
        aria: {
            controls: "navigation-menu"
        },
        testId: "hamburger-nav-btn",
        content: <span id={styles['hamburger-nav-icon']}/>
    };
    const rootNavListAttr = {
        id: styles['navigation-menu'],
        testId: "navigation-menu",
        classes: ''
    }
    const rootAttrs = {
        inputAttr: rootNavInputAttr,
        labelAttr: rootNavLabelAttr,
        listAttr: rootNavListAttr
    }
    const hasSubpages = pages.length > 0;
    const pageElms = pages.map((page: IPage, index: Number) => {
        const subpageListKey = `navigation-page-` + index;
        return (<SubpageList page={page} key={subpageListKey} />)
    });
    return (<NavigationItem attrs={rootAttrs} hasSubpages={hasSubpages} children={pageElms} />);
}