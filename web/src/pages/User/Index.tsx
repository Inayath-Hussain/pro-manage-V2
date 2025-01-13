import { Outlet } from "react-router-dom";
import WelcomeImage from '@web/assets/images/Group.png'
import styles from "./index.module.css";

const UserPage = () => {
    return (
        <main className={styles.user_container}>
            <section className={styles.welcome_container}>

                {/* welcome image */}
                <div className={styles.welcome_image_container}>
                    <img src={WelcomeImage} alt="" className={styles.welcome_image} />
                </div>

                <div className={styles.welcome_text}>
                    <h1>Welcome aboard my friend</h1>
                    <p>just a couple of clicks and we start</p>
                </div>

            </section>

            <Outlet />
        </main>
    );
}

export default UserPage;