'use client'
import styles from './navigation.module.scss';

export default function Navigation() { 
    return (<nav id={styles['navigation']}>
        <input id="hamburger-nav-toggle" className={styles['nav-toggle']} type="checkbox"/>
        <label htmlFor="hamburger-nav-toggle" id={styles['hamburger-nav-icon']} />
        <ul id={styles['navigation-menu']}>
            <li>test</li>
        </ul>
    </nav>)
}