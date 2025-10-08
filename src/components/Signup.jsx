import React from 'react'
import Navbar from './Navbar'

const SignupComp = () => {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#fff" }}>
      <div style={{ width: "100%", maxWidth: 420, margin: "0 auto", background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.05)", padding: 32 }}>
        <h2 style={{ textAlign: "center", fontWeight: 600, fontSize: 36, marginBottom: 32 }}>Log In</h2>
        <div style={{ display: "flex", alignItems: "center", margin: "24px 0" }}>
          <div style={{ flex: 1, height: 1, background: "#e0e0e0" }}></div>
          <span style={{ margin: "0 16px", color: "#888" }}>or</span>
          <div style={{ flex: 1, height: 1, background: "#e0e0e0" }}></div>
        </div>
        <form>
          <input type="email" placeholder="Email" style={{ width: "100%", padding: 12, marginBottom: 16, borderRadius: 4, border: "1px solid #ccc", fontSize: 16 }} />
          <input type="password" placeholder="Password" style={{ width: "100%", padding: 12, marginBottom: 16, borderRadius: 4, border: "1px solid #ccc", fontSize: 16 }} />
          <button type="submit" style={{ width: "100%", background: "#1976d2", color: "#fff", border: "none", borderRadius: 4, padding: "12px 0", fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Log In</button>
        </form>
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <span style={{ color: "#888" }}>Don't have an account? </span>
          <a href="/signup" style={{ color: "#1976d2", textDecoration: "none", fontWeight: 500 }}>Sign Up</a>
        </div>
      </div>
    </div>
  )
}

const Signup = () =>{
  return(
    <>
    <Navbar/>
    <SignupComp/>
    </>
  )
}

export default Signup