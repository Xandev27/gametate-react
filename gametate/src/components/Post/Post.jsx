import PostOption from './PostOption'
import { useEffect, useState } from 'react'

function Publication ({ id, userID, checkOwner, userOwner, description, meGusta, content, avatar }) {
  const [postDeleted, setPostDeleted] = useState(false)
  const handlePostDeleted = () => {
    setPostDeleted(true)
  }

  const [like, setLike] = useState()
  useEffect(() => {
    fetch('http://localhost:3000/interact/getInteractionLike?id=' + id + '&userID=' + userID)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setLike(data.result[0].content === -1 ? 1 : -1)
        } else {
          setLike(1)
        }
      })
  }, [])

  const [likeDisplay, setLikeDisplay] = useState(meGusta)

  const handleSubmitLike = (event) => {
    event.preventDefault()
    if (userID) {
      fetch('http://localhost:3000/interact/like', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ like, id, userID })
      })
        .then(response => response.json())
        .then(data => {
          setLikeDisplay(data.postLike)
        })
      setLike(like === -1 ? 1 : -1)
    }
  }

  return (
    <div className="publication">
                <div className="publication__info">
                    <div className="publication__user">
                        <img src={`data:image/jpeg;base64,${avatar}`} className="user__avatar"/>
                        <span><a href="users/" className="user__link">{userOwner}</a></span>
                    </div>
                    <PostOption isOwner={checkOwner} id={id} handlePostDeleted={handlePostDeleted}/>
                </div>
              {!postDeleted
                ? (
              <>
                <div className="publication__description">
                    {description}
                </div>
                <div className="publication__content">
                    {/* <?php if ($row['image']): ?> */}
                    {content && <img src={`data:image/jpeg;base64,${content}`} alt="Post" className='content__img'/>}
                </div>

                    <div className="publication__reactions">
                      <span className="reactions__span">

                          <a href="#" className="reactions__link reactions__link-like">
                            <span className="reactions__link-like--amount">
                                {likeDisplay}
                            </span> Likes
                          </a>

                      </span>

                      <span className="reactions__span">

                          <a href="#" className="reactions__link">1 comentario</a>
                          <a href="#" className="reactions__link">1 vez compartido</a>

                      </span>
                    </div>
                <div className="publication__interact">
                    <form
                        className="interact__form form_interact-like"
                        onSubmit={handleSubmitLike}
                    >
                        <input
                        type="submit"
                        value={ like === -1 ? 'Ya no me gusta' : 'Me gusta' }
                        className="interact__form-input interact__form-input--like"
                        />
                    </form>

                    <form
                        className="interact__form form_interact-comment"
                    >
                        <input
                        type="submit"
                        value="Comentar"
                        className="interact__form-input"
                        />
                    </form>

                    <form
                        action="backend/interact.php"
                        method="post"
                        className="interact__form form_interact-share"
                    >
                        <input
                        type="submit"
                        value="Compartir"
                        className="interact__form-input interact__form-input--share"
                        />
                    </form>
                </div>
              </>)
                : (
              <>
                <div className="publication__description">
                  <h3 style={{ textAlign: 'center', color: '#2c3e50', paddingBottom: '20px', fontWeight: 'lighter', display: 'flex', flexDirection: 'column', gap: '.8em' }}>Eliminaste esta publicacion<i className="fa-solid fa-ghost"></i></h3>
                </div>
              </>)}
    </div>
  )
}

export default Publication
