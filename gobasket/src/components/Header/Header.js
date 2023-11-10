import React, {useState, useRef} from "react";

import { useCookies } from 'react-cookie';
// import { Link } from "react-scroll";

import logo from "../../resources/img/logo.svg";

import * as Scroll from 'react-scroll';

// import ""

const Header = () => {
    let scroll = Scroll.animateScroll;

    const scrollForward = (container) => {
      console.log('SCROLL')
      scroll.scrollMore(100, {
        vertical: 'true',
        horizontal: 'true',
        containerId: container,
      });
    };

    const [cookies, setCookie] = useCookies(['userId']);

    const mobileMenu = useRef(null)
    // const closeMobileMenu = useRef(null)

    const toggleMenu = () => {
        console.log(mobileMenu.current)
        mobileMenu.current.classList.toggle('show')
    }

    console.log('COOKIE EBYSHIE: ', cookies.userId)

    return (
        <header className="header">
            <div className="header-container">
                <div className="header-logo">
                    <img src={logo} alt="gobasket" />
                </div>
                <nav className="header-navbar">
                    {/* <Link className="header-navbar__item" activeClass="active" to="pidaras" spy={true} smooth={true} duration={500}>События </Link> */}
                    {/* <div className="header-navbar__item" onClick={() => scrollForward('pidaras')}>События </div> */}
                    {/* <Link className="header-navbar__item" activeClass="active" to="pidaras2" spy={true} smooth={true} duration={500}>Погода </Link> */}
                    <a href="#" className="header-navbar__item">События</a>
                    <a href="#" className="header-navbar__item">Погода</a>
                    <a href="#" className="header-navbar__item btn btn-stroke">Войти</a>
                </nav>
                <div id="header-burger"
                     onClick={toggleMenu}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <nav ref={mobileMenu} className="navbar-mobile">
                    <div onClick={toggleMenu} className="navbar-mobile__close">
                        <span></span>
                        <span></span>
                    </div>
                    <a href="#" className="navbar-mobile__item">События</a>
                    <a href="#" className="navbar-mobile__item">Погода</a>
                    <a href="#" className="navbar-mobile__item btn btn-stroke">Войти</a>
                </nav>
            </div>
        </header>
    )
}

export default Header