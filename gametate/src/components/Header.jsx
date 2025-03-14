import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'

function Header ({ username, avatar }) {
  const [menuClicked, setMenuClicked] = useState(false)

  const handleButtonMenu = () => {
    setMenuClicked(prevEstado => !prevEstado)
  }

  const handleLogout = () => {
    fetch('http://localhost:3000/logout', {
      method: 'POST',
      credentials: 'include'
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          window.location.href = '/'
        }
      })
  }

  const [hasLogin, setHasLogin] = useState(false)

  useEffect(() => {
    const token = Cookies.get('access_token')
    setHasLogin(!!token)
  }, [])

  return (
        <header className="header">
            <h1>GameTate</h1>
            <nav className="header__nav">
                <ul>
                    <li><a href=""><i className="fa-solid fa-house"></i> Inicio</a></li>
                    <li><a href="">Publicaciones</a></li>
                    <li><a href=""><i className="fa-solid fa-users"></i> Amigos</a></li>
                    <li><a href=""><i className="fa-solid fa-user"></i> Perfil</a></li>
                </ul>
            </nav>
            <div className="header__user">
                {hasLogin
                  ? <><div className="header__notification">
                    <i className="fa-solid fa-bell"></i>
                </div>
                <div className="header__avatar" onClick={handleButtonMenu}>
                  {avatar && <img src={avatar} alt="Avatar" className="header__avatar" />}
                </div>
                <div className={`header__menu ${menuClicked ? 'header__menu--visible' : ''}`}>
                    <ul>
                        <li><h3>{username}</h3></li>
                        <li><a href="">Perfil</a></li>
                        <li><a href=""><i className="fa-solid fa-gear"></i> Configuracion</a></li>
                        <li onClick={handleLogout}><i className="fa-solid fa-right-from-bracket"></i> Cerrar sesion</li>
                    </ul>
                </div></>
                  : <>
                  <a href="/login">Iniciar Sesion</a>
                  <a href="/register">Registrate</a></>}
            </div>
        </header>
  )
}

export default Header
