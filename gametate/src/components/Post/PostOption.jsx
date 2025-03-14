import { useState } from 'react'

function PostOption ({ isOwner, id, handlePostDeleted }) {
  const [menuClicked, setMenuClicked] = useState(false)
  const [deleteClicked, setDeleteClicked] = useState(false)
  const [confirmYesClicked, setConfirmYesClicked] = useState(false)

  const handleButtonMenu = () => {
    setMenuClicked(prevEstado => !prevEstado)
  }

  const handleButtonDelete = () => {
    setDeleteClicked(prevEstado => !prevEstado)
  }

  const handleButtonConfirmYes = () => {
    setConfirmYesClicked(true)
    fetch('http://localhost:3000/post/deletePost', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id })
    })
      .then(response => response.json())
      .then(data => console.log(data))
    handlePostDeleted(true)
  }

  return (

    <div className="publication__options">
      <div className='publication__options-button'>
        <i className="fa-solid fa-list publication__options-button--i" onClick={handleButtonMenu}></i>
      </div>
        <div className={`publication-options__menu publication-menu ${menuClicked && !confirmYesClicked ? 'publication-options__menu--visible' : ''}`} style={confirmYesClicked ? { display: 'none' } : {}}>

          <span className='publication-options__menu-span publication-options__menu-span--report'>Guardar Publicacion</span>

          <span className='publication-options__menu-span publication-options__menu-span--report'>Reportar</span>

                {isOwner && (
                    <>
                    <span className='publication-options__menu-span publication-options__menu-span--edit'>Editar</span>

                    <div onClick={handleButtonDelete} className='publication-options__menu-span publication-options__menu-span--delete'>
                        Borrar
                        <i className={`fa-solid fa-angle-right menu__span-deleteArrow ${deleteClicked ? 'menu__span-delete--deploy' : ''}`}></i>
                    </div>

                    <div className={`publication-options__menu-span publication-options__menu-span--confirm ${deleteClicked ? 'visible--flex' : ''}`}>
                        <div>Eliminar esta publicacion</div>
                        <div className="menu__span-confirm--selection">
                            <span className="menu__span-confirm--yes" title="Si" onClick={handleButtonConfirmYes}><i className="fa-solid fa-check"></i></span>
                            <span className="menu__span-confirm--no" title="No"><i className="fa-solid fa-xmark"></i></span>
                        </div>
                    </div>
                    </>
                )}
        </div>
    </div>
  )
}

export default PostOption
