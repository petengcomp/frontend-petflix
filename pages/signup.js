import styles from '@/styles/pages/Signup.module.css'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { SignupForm } from '@/components/SignupForm'

function Signup() {
    return (
        <div className={styles.signup}>
            <div className={styles.main}>
                <h2 className={styles.title}>SIGN UP</h2>
                <SignupForm/>
            </div>
            <Footer />
        </div>
    )
}

export default Signup