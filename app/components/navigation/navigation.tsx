import styles from './navigation.module.scss';
import IPage from '@/app/models/IPage';
import NavigationList from './navigation-list';

export default function Navigation({ pages }: {
    pages: IPage[]
}) {
    return (
        <nav id={styles['navigation']} data-testid="navigation">
            <NavigationList pages={pages} />
        </nav>
    )
}
