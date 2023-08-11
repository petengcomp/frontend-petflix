import Image from 'next/image'

import styles from '../styles/components/SignupForm.module.css'

import exampleProfilePic from "@/assets/exempleProfilePic.png"
import expandIcon from "@/assets/iconExpand.svg"
import { useEffect, useState } from 'react'

import { api } from '@/services/api';

export function SignupForm(){
    const [isExpanded, setExpanded] = useState(false)
    const [user, setUser] = useState({
        name: "",
        password: "",
        email: "",
        profilePic: 0
    })
    const [confirmPassword, setConfirmedPass] = useState("")
/*
    const requestPictures = async (authorization) => {
        let response
        try {
            response = await api.get("/api/user", {
                headers: {
                    Authorization: authorization,
                },
            })
        } catch (err) {
            return {
                redirect: {
                    destination: "/login",
                    permanent: false,
                },
            }
        }
    }
*/

    const [images, setImages] = useState([])

    useEffect(() => {
        async function fetchImages() {
            const response = await api.get("/api/avatar")
            const { amountOfAvatars } = response.data;

            for (let i = 1; i <= amountOfAvatars; i++) {
                let im = `https://api-petflix.pet.inf.ufes.br/public/avatar/${i}.png`
                setImages(prevImages => [...prevImages, im])
            }
        }
        fetchImages();
    }, [])

    const handle_expand = () => {
        setExpanded(!isExpanded)
    }

    const handleChangeName = (e) => {
        setUser({...user, name: e.target.value})
    }
    const handleChangeEmail = (e) => {
        setUser({...user, email: e.target.value})
    }
    const handleChangePassword = (e) => {
        setUser({...user, password: e.target.value})
    }
    const handleChangeConfirm = (e) => {
        setConfirmedPass(e.target.value)
    }

    const handleClick  = (index) => {
        setUser({...user, profilePic: +index})
    }

    const handleCreateAcc = (e) => {
        e.preventDefault()
        if (user.password === confirmPassword) {
            //console.log(user)
            //console.log(confirmPassword)
            
            api.post("/api/user", user)
            .then((response) => {
                console.log(response)
                if (response.status === 200 || response.status === 201) {
                    window.location.href = "/login"
                }
            }
            )
            .catch((err) => {
                console.log(err)
            }
            )
        }
        else {
            console.log("As senhas não batem.")
        }
    }


    return (
        <div className={styles.main}>
        <form noValidate action="" className={styles.signupForm}>
            <label className={styles.formComponent}>
                NAME<br></br>
                <input autoComplete="name" className={styles.formInput} type="text" value={user.name} name="name" placeholder="Fulano da Silva" onChange={handleChangeName}/>
            </label>
            <label className={styles.formComponent}>
                EMAIL<br></br>
                <input autoComplete="email" className={styles.formInput} type="email" value={user.email} name="email" placeholder="fulaneides@example.com" onChange={handleChangeEmail}/>
            </label>
            <label className={styles.formComponent}>
                PASSWORD<br></br>
                <input className={styles.formInput} type="password" value={user.password} name="password" placeholder="**************" onChange={handleChangePassword}/>
            </label>
            <label className={styles.formComponent}>
                CONFIRM YOUR PASSWORD<br></br>
                <input className={styles.formInput} type="password" value={confirmPassword} name="passwordConfirm" placeholder="**************" onChange={handleChangeConfirm}/>
            </label>
            <input type="submit" id={styles.submitBtn} onClick={handleCreateAcc} value="CREATE ACCOUNT" name="createAccount"/>
        </form>
        <div className={styles.profileContainer}>
            PROFILE PICTURE<br></br>
            <div className={styles.profileChoice}>
            {images.map((image, index) => {
                const isActive = index === (user.profilePic - 1); // Checa se a imagem está ativa
                const showImage = index < (isExpanded ? images.length : 9);
                if (!showImage) {
                    return null;
                }
                return (
                    <div className={styles.profilePicContainer} key={index}>
                        <button
                            className={`${styles.profileButton} ${isActive ? styles.active : ''}`} // Adiciona a classe active se a imagem estiver ativa
                            onClick={() => handleClick(index + 1)}
                        >
                            <Image src={image} width={202} height={202} className={styles.profilePic} alt="" />
                        </button>
                    </div>
                );
            })}
                <div className={styles.profilePicContainer}>
                    <button className={styles.profileButton} id={styles.expand} onClick={handle_expand}>
                        <Image src={expandIcon} className={styles.expandIcon} style={isExpanded ? {rotate: '180deg'}: {}} alt=""/>
                    </button>
                </div>
            </div>
        </div>
        </div>
    )
}