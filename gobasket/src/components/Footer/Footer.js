import React from "react";

import logo from "../../resources/img/logo.svg";

const Footer = () => {

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-container__logo">
          <img src={logo} alt="gobasket" />
        </div>
        <div className="footer-container__link">
          Разработчик: <a href="https://t.me/vityapain">Заблоцкий Виктор</a>
        </div>
      </div>
      <div className="footer__bottom">
        &#169; Политика конфиденциальности
      </div>
    </footer>
  )
}

export default Footer