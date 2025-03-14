/* eslint-disable no-unused-vars */
import Publication from '../components/Post/Post.jsx'

import Friend from '../components/Friend/Friend.jsx'
import Header from '../components/Header.jsx'
import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'

function App () {
  const [post, setPost] = useState([])
  const [sessionData, setSessionData] = useState([])
  const [hasLogin, setHasLogin] = useState(false)

  useEffect(() => {
    const token = Cookies.get('access_token')
    setHasLogin(!!token)

    fetch('http://localhost:3000/getCookie', {
      credentials: 'include'
    })
      .then(response => response.json())
      .then(data => {
        setSessionData(data)
      })

    fetch('http://localhost:3000/publicaciones')
      .then(response => response.json())
      .then(data => {
        setPost(data.result)
      })
  }, [])

  const [createPostClicked, setCreatePostClicked] = useState(false)

  const handleMenuCreatePost = () => {
    setCreatePostClicked(prevEstado => !prevEstado)
  }

  const [imagePreview, setImagePreview] = useState()
  const [imagePost, setImagePost] = useState()
  const [description, setDescription] = useState('')
  const [newPostData, setNewPostData] = useState()

  const handleImagePreview = (e) => {
    setImagePost(e.target.files[0])
    let file = e.target.files[0]
    file = URL.createObjectURL(file)
    setImagePreview(file)
    e.target.value = null
  }

  const removeImagePreview = () => {
    setImagePreview()
    setImagePost()
  }

  const handleSendPost = (event) => {
    event.preventDefault()
    if (description !== '' || imagePost !== undefined) {
      const formData = new FormData()
      formData.append('imagePreview', imagePost)
      formData.append('description', description)
      formData.append('sessionData', JSON.stringify({ id: sessionData.id }))
      fetch('http://localhost:3000/post/sendPost', {
        method: 'POST',
        credentials: 'include',
        body: formData
      })
        .then(response => response.json())
        .then(data => {
          setNewPostData(data)
        })
    }
  }

  return (
    <>
    <Header username={sessionData.username}/>
    <div className="container">
      <div className="foro">
        <div className="menu">
          {hasLogin
            ? (
            <span id="create" className="menu__link" onClick={handleMenuCreatePost}>Crear Publicacion</span>
              )
            : (
            <span>Inicia sesion para crear una nueva publicacion<a href="/login">Iniciar sesion</a></span>
              )}
          Filtar:
        </div>

        <form method="post" onSubmit={handleSendPost} className={`form ${createPostClicked && 'foro__form--visible'}`} id="form_create_publi" name="newPublication">
          <picture onClick={removeImagePreview} className={`form__image-preview ${imagePreview && 'form__image-preview--visible'}`}><i className="fa-solid fa-trash"></i><img src={imagePreview} alt="" /></picture>
          <textarea name="descripcion" onChange={(e) => {
            setDescription(e.target.value)
          }} className="form__textarea" placeholder="Ingresa el contenido de tu publicacion" wrap="hard" cols="80"></textarea>
          <input type="submit" name="subirPubli" value="Publicar" className="form__submit"/>
          <label htmlFor="image" className='form__label'><i className="fa-solid fa-camera"></i></label>
          <input type="file" accept=".jpg, .jpeg, .png" onInput={handleImagePreview} name="image" id="image" style={{ visibility: 'hidden' }}/>
        </form>
        { newPostData && <Publication userID={sessionData.id} id={newPostData.result.insertID} userOwner={sessionData.id} description={newPostData.description}/> }
        {
        post.map((val) => {
          return (
              <Publication key={val.id} userID={sessionData.id} id={val.id} checkOwner={val.user_id === sessionData.id} userOwner={val.user} description={val.description} meGusta={val.megusta} content={val.image} avatar={val.avatar}/>
          )
        })
        }
      </div>
      <aside className="seccion">
        <div className="friends">
          <h2>Amigos</h2>

          <div className="amistades">
            <Friend nameFriend={'Xander'} />
            <Friend nameFriend={'Kyubi'} />
            <Friend nameFriend={'Javier'} />
            <Friend nameFriend={'Jose'} />
          </div>
        </div>
          Ingresa
      </aside>
    </div>
  </>
  )
}

export default App
