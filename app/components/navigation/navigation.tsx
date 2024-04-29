'use client'
import styles from './navigation.module.scss';
import Link from 'next/link';
import IPage from '@/app/models/IPage';
import ISubpage from '@/app/models/ISubpage';

export default function Navigation({ pages }: {
    pages: IPage[]
}) { 
    return (<nav id={styles['navigation']}>
        <input id="hamburger-nav-toggle" className={styles['nav-toggle']} type="checkbox"/>
        <label htmlFor="hamburger-nav-toggle" id={styles['hamburger-nav-icon']} />
        <ul id={styles['navigation-menu']}>{
            pages.map((page:IPage) => {
                const keyName = page.name.toLowerCase().replaceAll(' ', '-');
                return (<li key={`nav-toplevellink-${keyName}`} className={styles['nav-toplevel-page']}>
                    <input id={`subpage-${keyName}`} className={styles['nav-subpages-toggle']} type="checkbox"/>
                    <label htmlFor={`subpage-${keyName}`} className={styles['nav-subpages-menu']} >
                        <p className={styles['top-level-link']}>{page.name}</p>
                    </label>
                    <ul className={styles['nav-subpages-list']}>{page.subpages.map((subpage:ISubpage) => {
                        const subpageKeyName = subpage.name.toLowerCase().replaceAll(' ', '-');
                        return <li key={`nav-toplevellink-${keyName}-sublink-${subpageKeyName}`} className={styles['sub-level-link']}>
                            <Link href={subpage.path}>{subpage.name}</Link>
                        </li>
                    })}</ul>
                </li>);
        })
        }</ul>
    </nav>)
}