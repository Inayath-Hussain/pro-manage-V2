import { Link, useLocation, useNavigate } from "react-router-dom";

import Logo from "@/assets/icons/pro-manage-logo.svg"
import LogoutIcon from '@/assets/icons/Logout.svg'
import useModal from "@/hooks/useModal";
import { useOnline } from "@/hooks/useOnline";
import { routes } from "@/routes";
import ConfirmModalComponent from "../modal/contents/Confirm";

import AnalyticsIcon from "../Icons/Analytics";
import BoardIcon from "../Icons/Board";
import SettingsIcon from "../Icons/Settings";
import { IIconProps } from "../Icons/interface";

import styles from "./NavBar.module.css"
import { useContext } from "react";
import { authTokenContext } from "@/context/authToken";


const NavBar = () => {

    const { pathname } = useLocation();
    const navigate = useNavigate();
    // const dispatch = useDispatch();

    const { logout } = useContext(authTokenContext);

    const { isOnline } = useOnline();
    const { showModal, hideModal, ModalPortal } = useModal();

    /**
     * to check if current url is same as the one provided in arguments
    */
    const isActiveLink = (path: string) => {
        if (pathname === path) return true
        return false
    }

    const handleLogout = async () => {
        logout();
        navigate(routes.user.login);
        hideModal();
        // try {
        //     // await logoutService()

        //     // dispatch(clearUserInfoAction());

        //     logout();
        //     navigate(routes.user.login);
        //     hideModal();
        // }
        // catch (ex) {
        //     if (ex instanceof NetworkError) return toast(ex.message, { type: "error" })  //Check your network and try again toast here

        //     // Something went wrong toast here
        //     toast("Something went wrong toast", { type: "error" })
        //     console.log("logout")
        // }
    }


    interface ILinks {
        IconComponent: React.FC<IIconProps>
        text: string
        route: string
    }

    const links: ILinks[] = [
        { IconComponent: BoardIcon, route: routes.home, text: "Board" },
        { IconComponent: AnalyticsIcon, route: routes.analytics, text: "Analytics" },
        { IconComponent: SettingsIcon, route: routes.settings, text: "Settings" }
    ]


    return (

        <section className={styles.nav_container} >

            <div className={`${styles.header_container} ${styles.flex}`} >
                <img src={Logo} alt="" className={styles.logo} />

                <h3 className={styles.header}>Pro Manage</h3>
            </div>


            <nav>
                {links.map(l => (

                    <Link to={l.route} title={l.text} key={l.route}
                        className={`${styles.link} ${styles.flex} ${isActiveLink(l.route) ? styles.active_link : ""}`} >

                        <l.IconComponent className={styles.logo} />
                        <p className={styles.link_text}>{l.text}</p>

                    </Link>

                ))}
            </nav>




            <button onClick={showModal} className={`${styles.logout_button} ${styles.flex}`}
                disabled={!isOnline} >

                <img src={LogoutIcon} alt="" className={styles.logo} />
                <p>Log out</p>

            </button>

            {/* this function appends logout modal to dom */}
            {ModalPortal(<ConfirmModalComponent action="Logout" handleConfirm={handleLogout} />)}

        </section>
    );
}

export default NavBar;