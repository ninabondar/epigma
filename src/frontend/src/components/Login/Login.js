import React from "react"

import BEM from "../../utils/BEM"
import "./Login.scss"

const b = BEM("Login")

const Login = () => {
  return (
    <form className={b()}>
      <input id={b("username")} type="text" required={true} placeholder={'login'}/>
      <input id={b("password")} type="password" required={true} placeholder={'password'}/>
      <button className={b("submit-btn")}>Proceed</button>
    </form>
  )
}

export default Login
