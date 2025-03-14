function ValidateInput ({ message, inputData }) {
  return (
    <>
    {!inputData && <span className="login-box__form-span--validError">{ message }</span>}
    </>
  )
}

export default ValidateInput
