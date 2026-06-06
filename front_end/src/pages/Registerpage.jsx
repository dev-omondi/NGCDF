import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useRegisterMutation } from '@/authRedux/baseApiSlice.js'
import { setCredentials } from '@/authRedux/authSlice.js'
import {useDispatch,useSelector} from "react-redux"
import { useNavigate } from 'react-router-dom'

const Registerpage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    secondName: "",
    email: "",
    password: "",
    confirmPassword:""
  })
  const[toggleConfirmPassword,setToggleConfirmPassword]=useState(false) 
  const [showPassword, setShowPassword] = useState(false)
  const[formError,setFormError]=useState("")

  const navigate=useNavigate()
  const dispatch=useDispatch()
  const userInfor=useSelector((state)=>state.auth.userInfor)
  const [register,{isLoading}]=useRegisterMutation()

  const handleSubmit=async(e)=>{
    e.preventDefault()
    setFormError("")
    
    try {
      if(formData.confirmPassword.trim()!==formData.password.trim()){
        return setFormError("Passwords dont match")
      }
      const userData={
        firstName:formData.firstName.trim(),
        secondName:formData.secondName.trim(),
        email:formData.email.trim(),
        password:formData.password.trim()
      }
      
      const res=await register(userData).unwrap()

      dispatch(setCredentials(res))
      setFormData({
        firstName:"",
        secondName:"",
        email:"",
        password:"",
        confirmPassword:""
      })
      navigate("/")
      
    } catch (error) {
      
      if (error?.data?.error?.length) {
        setFormError(error.data.error.join(", "))
    } else {
        setFormError(error?.data?.message || error?.error || "Something went wrong")
    }
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        /* ALL selectors scoped to .rp-root — zero global side-effects */

        .rp-root,
        .rp-root *,
        .rp-root *::before,
        .rp-root *::after {
          box-sizing: border-box;
        }

        .rp-root {
          min-height: 100vh;
          background: #f0f4ff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
          padding: 24px;
          position: relative;
          overflow: hidden;
        }

        /* Soft blue ambient blobs */
        .rp-blob {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
        }
        .rp-blob-1 {
          top: -120px;
          left: -100px;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%);
        }
        .rp-blob-2 {
          bottom: -100px;
          right: -80px;
          width: 420px;
          height: 420px;
          background: radial-gradient(circle, rgba(59,130,246,0.10) 0%, transparent 70%);
        }

        .rp-card {
          width: 100%;
          max-width: 440px;
          background: #ffffff;
          border: 1px solid rgba(99,102,241,0.12);
          border-radius: 20px;
          padding: 40px 36px;
          box-shadow:
            0 4px 6px rgba(99,102,241,0.04),
            0 20px 48px rgba(99,102,241,0.10),
            0 1px 0 rgba(255,255,255,0.9) inset;
          position: relative;
          z-index: 1;
          animation: rp-fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes rp-fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Blue accent hairline top */
        .rp-card::before {
          content: '';
          position: absolute;
          top: 0; left: 50%; transform: translateX(-50%);
          width: 55%;
          height: 2px;
          background: linear-gradient(90deg, transparent, #6366f1, #3b82f6, transparent);
          border-radius: 0 0 4px 4px;
        }

        .rp-header {
          margin-bottom: 28px;
        }

        .rp-eyebrow {
          font-family: 'Syne', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #6366f1;
          margin: 0 0 10px 0;
          padding: 0;
        }

        .rp-title {
          font-family: 'Syne', sans-serif;
          font-size: 26px;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.2;
          margin: 0 0 8px 0;
          padding: 0;
        }

        .rp-description {
          font-size: 14px;
          color: #64748b;
          font-weight: 400;
          line-height: 1.5;
          margin: 0;
          padding: 0;
        }

        .rp-sign-in-top {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 13px;
          font-weight: 500;
          color: #6366f1;
          cursor: pointer;
          margin: 12px 0 0 0;
          padding: 0;
          background: none;
          border: none;
          font-family: 'DM Sans', sans-serif;
          transition: color 0.2s;
        }
        .rp-sign-in-top:hover { color: #4f46e5; }
        .rp-sign-in-top svg { transition: transform 0.2s; }
        .rp-sign-in-top:hover svg { transform: translateX(3px); }

        .rp-fields {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .rp-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .rp-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .rp-label {
          font-size: 12px;
          font-weight: 600;
          color: #334155;
          letter-spacing: 0.04em;
          margin: 0;
          padding: 0;
        }

        .rp-input {
          width: 100%;
          background: #f8faff;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 11px 40px 11px 14px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          color: #0f172a;
          outline: none;
          margin: 0;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }
        .rp-input::placeholder { color: #cbd5e1; }

        .rp-input:focus {
          border-color: #6366f1;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
        }

        .rp-input-wrap {
          position: relative;
        }

        .rp-eye-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          padding: 0;
          margin: 0;
          cursor: pointer;
          color: #6366f1;
          display: flex;
          align-items: center;
          transition: color 0.2s;
        }
        .rp-eye-btn:hover { color: #4f46e5; }

        .rp-submit {
          width: 100%;
          margin: 8px 0 0 0;
          padding: 13px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.03em;
          color: #fff;
          background: linear-gradient(135deg, #4f46e5 0%, #6366f1 60%, #3b82f6 100%);
          box-shadow: 0 4px 14px rgba(99, 102, 241, 0.35);
          transition: transform 0.15s, box-shadow 0.2s;
        }
        .rp-submit:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(99, 102, 241, 0.45);
        }
        .rp-submit:active { transform: translateY(0); }

        .rp-footer {
          margin: 24px 0 0 0;
          text-align: center;
          font-size: 13px;
          color: #94a3b8;
          padding: 0;
        }

        .rp-footer-link {
          color: #6366f1;
          font-weight: 600;
          cursor: pointer;
          background: none;
          border: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          padding: 0;
          margin: 0;
          transition: color 0.2s;
        }
        .rp-footer-link:hover { color: #4f46e5; text-decoration: underline; }
      `}</style>

      <div className="rp-root">
        <div className="rp-blob rp-blob-1" />
        <div className="rp-blob rp-blob-2" />

        <div className="rp-card">
          <div className="rp-header">
            <p className="rp-eyebrow">Welcome</p>
            <h1 className="rp-title">Create your account</h1>
            <p className="rp-description">Fill in the details below to get started.</p>
            <button className="rp-sign-in-top"
            onClick={()=>navigate("/login")}
            >
              Already have an account? Sign In
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <form className="rp-fields" onSubmit={handleSubmit} >
                        {formError && (
                            <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                                {formError}
                            </p>
                        )}
            <div className="rp-row">
              <div className="rp-field">
                <label className="rp-label">First Name</label>
                <input className="rp-input" type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Jane" required />
              </div>
              <div className="rp-field">
                <label className="rp-label">Last Name</label>
                <input className="rp-input" type="text" name="secondName" value={formData.secondName} onChange={handleChange} placeholder="Doe" required />
              </div>
            </div>

            <div className="rp-field">
              <label className="rp-label">Email Address</label>
              <input className="rp-input" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="jane@example.com" required />
            </div>

            <div className="rp-field">
              <label className="rp-label">Password</label>
              <div className="rp-input-wrap">
                <input className="rp-input" type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required />
                <button type="button" className="rp-eye-btn" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="rp-field">
              <label className="rp-label">confirmPassowrd</label>
              <div className="rp-input-wrap">
                <input className="rp-input" type={toggleConfirmPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" required />
                <button type="button" className="rp-eye-btn" onClick={() => setToggleConfirmPassword(!toggleConfirmPassword)}>
                  {toggleConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" 
            disabled={isLoading}
            className={`rp-submit ${isLoading?"opacity-60 cursor-not-allowed":""}`}>Create Account</button>
          </form>

          <div className="rp-footer">
            Already have an account?{' '}
            <button className="rp-footer-link"
            onClick={()=>navigate("/login")}
            >Sign In</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Registerpage
