function Friend({ nameFriend }) {
  return (
            <>
          <div className="amigos">
            <div className="amigos__users">
              {/* <img src="data:image/jpg;base64,<?php echo base64_encode($amigo['avatar']);?>" className="amigos__users-avatar"/> */}
              <div>{nameFriend}</div>
            </div>

            <div className="amigos__actions">
              <div className="amigos__actions-icon">
                <i className="fa-regular fa-comments"></i>
              </div>
              <div
                className="amigos__actions-icon amigos__actions-icon--delete"
                title="Eliminar de tu lista de amigos"
              >
                <i className="fa-solid fa-user-minus"></i>
              </div>
            </div>
          </div></>
  )
}

export default Friend;
