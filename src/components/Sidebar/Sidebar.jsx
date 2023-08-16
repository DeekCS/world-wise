import Logo from '../Logo/Logo.jsx';
import AppNav from '../../pages/AppNav.jsx';
import styles from './Sidebar.module.css';
import {Outlet} from 'react-router-dom';
export default function Sidebar() {
    return (
        <div className={styles.sidebar}>
              <Logo />
            <AppNav />
            <Outlet />
            <footer
                className={styles.footer}
            >
                <p className={styles.copyright}>
                    &copy; {new Date().getFullYear()} World Wise Inc.
                </p>
            </footer>
        </div>
    )
}