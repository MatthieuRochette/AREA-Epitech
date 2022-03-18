import React, { useState, useEffect } from 'react'
import './Navbar.css'
import axios from 'axios';

export default function Navbar() {

    const [toggleMenu, setToggleMenu] = useState(false)
    const [largeur, setLargeur] = useState(window.innerWidth)

    const toggleNavSmallScreen = () => {
        setToggleMenu(!toggleMenu)
    }

    const goDisconnect = () => {
        axios({
            method: 'GET',
            url: `${process.env.REACT_APP_API_HOST}/user`,
            headers: {'Content-Type': `Bearer ${localStorage.getItem('token')}` }
        }).then(res =>{
            console.log(res)
        }).catch(res =>{
            console.error(res)
        })
        window.location.href="/Login"
        localStorage.setItem('token', "null")
    }

    const goServices = () => {
        window.location.href="/Services"
    }

    const goActions = () => {
        window.location.href="/Actions"
    }

    const goMyAction = () => {
        window.location.href="/my_actions"
    }

    const goDelete = () => {
        //Delete avec Axios
        localStorage.setItem('token', "null")
        window.location.href="/Login"
    }

    useEffect(() => {

        const changeWidth = () => {
            setLargeur(window.innerWidth)
            if(window.innerWidth > 700){
                setToggleMenu(false);
            }
        }

        window.addEventListener('resize', changeWidth)
        
        return() => {
            window.removeEventListener('resize', changeWidth)
        }

    }, [])

    return (
        <nav>
            {(toggleMenu || largeur > 700) && (
                <ul className="liste_nav">
                    <li className="items_nav" onClick={goActions}>Actions</li>
                    <li className="items_nav" onClick={goServices}>Services</li>
                    <li className="items_nav" onClick={goMyAction}>My actions</li>
                    <li className="items_nav" onClick={goDisconnect}><i className="fa fa-times" aria-hidden="true"></i> Disconnect</li>
                    <li className="items_nav" onClick={goDelete}><i className="fa fa-trash-o fa-lg" aria-hidden="true"></i> Delete my account</li>
                </ul>
            )}
            <button onClick={toggleNavSmallScreen}  className="btn_nav">Menu</button>
        </nav>
    )
}
