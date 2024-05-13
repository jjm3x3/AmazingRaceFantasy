'use client'
import styles from './navigation.module.scss';
import NavigationItem from './navigation-item';
import SubpageNavItem from './subpage-nav-item';
import IPage from '@/app/models/IPage';
import ISubpage from '@/app/models/ISubpage';


export default function SubpageList({ page }:{ page: IPage }) { 
    const keyName = page.name.toLowerCase().replaceAll(' ', '-');
    const hasSubpages = page.hasOwnProperty('subpages') && page.subpages.length > 0;
    const subpageInputAttr = {
        id: `subpage-${keyName}-input`,
        classes: styles['nav-subpages-toggle'],
    }
    const subpageLabelAttr = {
        id: `subpage-${keyName}-label`,
        content: <p className={styles['top-level-link']}>{page.name}</p>,
        classes: styles['nav-subpages-menu'],
        aria: {
            controls: `subpage-${keyName}-dropdown`
        },
        testId: `subpage-${keyName}-label`
    }
    const subpageListAttr = {
        id: `subpage-${keyName}-dropdown`,
        testId: `subpage-${keyName}-dropdown`,
        classes: styles['nav-subpages-list']
    }
    const subpageAttrs = {
        inputAttr: subpageInputAttr,
        listAttr: subpageListAttr,
        labelAttr: subpageLabelAttr
    }
    return (
        <li key={`nav-toplevellink-${keyName}`} className={styles['nav-toplevel-page']}>
            <NavigationItem hasSubpages={hasSubpages} attrs={subpageAttrs} children={
                page.subpages.map((subpage: ISubpage, index: Number) => {
                    const subpageNavItemKey = `subpage-nav-item-` + index;
                    return <SubpageNavItem subpage={subpage} key={subpageNavItemKey} />
                })}
            />
        </li>
    )
}
