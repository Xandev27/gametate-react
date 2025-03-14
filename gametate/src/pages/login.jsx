import { useState, useEffect } from 'react'
import ValidateInput from '../components/ValidateInput'
import Cookies from 'js-cookie'

function App () {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    if (email !== '' && password !== '') {
      fetch('http://localhost:3000/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            window.location.href = '/'
          } else {
            setErrorMessage('Contraseña incorrecta')
          }
        })
        .catch((error) => {
          console.error('Error', error)
        })
    }
    setIsSubmitted(true)
  }

  const [hasCookie, setHasCookie] = useState(false)

  useEffect(() => {
    const token = Cookies.get('access_token')
    setHasCookie(!!token)
  }, [])

  if (hasCookie) {
  }

  return (
        <>
        <div className="container">

        <h1 id="slogan">Una cuenta<br/>para todos los servicios de Atam<br/><a href="../aboutus.html">Leer mas...</a></h1>

          <div className="login-box">

            <h1>Inicio de sesion</h1>
            <h2>Inicia sesion con tu cuenta de Atam</h2>

            <form onSubmit={handleSubmit} method="POST" className="login-box__form">

              <div className="input-container">
                <label htmlFor="user" className="login-box__form-label">Correo electronico</label>
                <input type="email" onChange={(e) => setEmail(e.target.value)} name="email" className="login-box__form-input" id="user" autoComplete="false"/>
                {isSubmitted && <ValidateInput message='Ingresa tu correo electronico' inputData={email}/>}
              </div>

              <div className="input-container">
                <label htmlFor="password" className="login-box__form-label">Contraseña</label>
                <input type="password" onChange={(e) => {
                  setPassword(e.target.value)
                  setErrorMessage('')
                }} name="password" className="login-box__form-input" id="password" autoComplete="false"/>
                {isSubmitted && <ValidateInput message='Ingresa tu contraseña' inputData={password}/>}
                <span className="login-box__form-span--validError">{errorMessage}</span>
              </div>

              <button className="login-box__form-button"><span className="login-box__form-button-span">ingresar</span><span className="login-box__form-button-span--arrow"><i className="icon-arrow-right"></i></span></button>

              <span className="login-box__form-span">

              <label htmlFor="remember" className="login-box__form-label">Recordarme</label>
              <input type="checkbox" name="remember" id="remember" className="login-box__form-span-chkbox"/>

              </span>

            </form>

            <div className="acc">

              <span>¿olvidaste tu contraseña?<a href="">Restablecela aqui!</a></span>
              <span>¿no tienes una cuenta? <a href="/register">Registrate</a></span>

            </div>

          </div>
        </div>
        </>
  )
}

export default App
