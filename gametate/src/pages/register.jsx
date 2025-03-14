import { useState } from 'react'
import ValidateInput from '../components/ValidateInput'

function register () {
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState({
    user: '',
    email: '',
    password: '',
    confirm_password: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const handleInput = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }
  const handleSubmit = (event) => {
    event.preventDefault()
    if (formData.user !== '' && formData.email !== '' && formData.password !== '' && formData.confirm_password !== '' && formData.password === formData.confirm_password && step < 1) {
      setStep(1)
    }
    if (formData.user !== '' && formData.email !== '' && formData.password !== '' && formData.confirm_password !== '' && formData.password === formData.confirm_password && step === 1) {
      fetch('http://localhost:3000/register', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ formData, image })
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            window.location.href = '/'
          } else {
            console.log('vermo chamo')
          }
        })
    }
    setIsSubmitted(true)
  }
  const [image, setImage] = useState()
  const handleImageUpload = (e) => {
    let file = e.files[0]
    file = URL.createObjectURL(file)
    setImage(file)
  }
  return (
    <div className="container">

        <h2 id="slogan">Una cuenta<br/>para todos los servicios de Atam<br/><a href="../aboutus.html">Leer mas...</a></h2>

      <div className="login-box">

      <h1>SignUp</h1>

      <form action="" onSubmit={handleSubmit} method="POST" className="login-box__form">

      <div className={`step ${step === 1 ? 'step--hidden' : ''}`}>
        <label htmlFor="" className="login-box__form-label">Nombre de usuario</label>
        <input type="text" onChange={handleInput} name="user" id="" className="login-box__form-input"/>
        {isSubmitted && <ValidateInput message="Ingresa un nombre de usuario" inputData={formData.user}/>}

        <label htmlFor="" className="login-box__form-label">Correo electronico</label>
        <input name="email" onChange={handleInput} type="text" className="login-box__form-input"/>
        {isSubmitted && <ValidateInput message="Ingresa un correo electronico" inputData={formData.email}/>}

        <label htmlFor="password" className="login-box__form-label">Contraseña</label>
        <input name="password" onChange={handleInput} id="password" type="password" className="login-box__form-input"/>
        {isSubmitted && <ValidateInput message="Ingresa una contraseña" inputData={formData.password}/>}

        <label htmlFor="confirm_password" className="login-box__form-label">Confirma tu contraseña</label>
        <input name="confirm_password" onChange={handleInput} id="confirm_password" type="password" className="login-box__form-input"/>
        {isSubmitted && <ValidateInput message="Ingresa un correo electronico" inputData={formData.email}/>}
      </div>

      <div className={`step ${step < 1 ? 'step--hidden' : ''}`}>
        <div className='login-box__form-preview'>
          <label htmlFor="image_uploads" id="imagePreview"></label>
          <input type="file" onChange={(e) => { handleImageUpload(e.target) }} id="image_uploads" name="image_uploads" accept=".jpg, .jpeg, .png" className="login-box__form-avatar"/>
          <img src={image} alt="" />
        </div>
        {isSubmitted && <ValidateInput message="Ingresa un correo electronico" inputData={formData.email}/>}
      </div>

        <div className="login-box__form-div--terms">
          <span>Acepto los <a href="#">terminos y condiciones</a><input type="checkbox" name="" id="terms" className="login-box__form-checkbox"/></span>

          <span>Recibir notificaciones sobre ofertas de Atam <input type="checkbox" name="" id="oferts" className="login-box__form-checkbox"/></span>

        </div>

        <input type="hidden" name="form" value="1"/>

        <input type="submit" value="Continuar" className="login-box__form-button"/>

      </form>

      <div className="acc">

        <span>¿Ya tienes una cuenta?<a href="/login">Inicia sesion</a></span>

      </div>

      </div>
    </div>
  )
}

export default register
