'use client'
import styles from './navigation.module.scss';
import Link from 'next/link';
import ISubpage from '@/app/models/ISubpage';

export default function SubpageNavItem({ subpage }:{ subpage: ISubpage }) { 
    const keyName = subpage.name.toLowerCase().replaceAll(' ', '-');
    const subpageKeyName = subpage.name.toLowerCase().replaceAll(' ', '-');
    return <li key={`nav-toplevellink-${keyName}-sublink-${subpageKeyName}`}>
        <Link href={subpage.path} className={styles['sub-level-link']}>{subpage.name}</Link>
    </li>
}
