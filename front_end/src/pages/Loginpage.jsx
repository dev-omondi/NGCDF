import React, { useState ,useEffect} from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useLoginMutation } from '@/authRedux/baseApiSlice.js'
import { setCredentials } from '@/authRedux/authSlice.js'
import { useSelector,useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const Signinpage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const[formError,setFormError]=useState("")
  
  const dispatch=useDispatch()
  const navigate=useNavigate()
  const userInfor=useSelector((state)=>state.auth.userInfor)
  const [login,{isLoading}]=useLoginMutation()
  const [showPassword, setShowPassword] = useState(false)
 

   useEffect(()=>{
    console.log(userInfor)
    if(isLoading)return
    console.log(userInfor?.role)
      if(userInfor){
        if(userInfor.role==="admin"){
          navigate("/admin/dashboard")
        }else{
          navigate("/login")
        }
      }
    },[userInfor])

  const handleSubmit=async(e)=>{
    e.preventDefault()
    setFormError("")
    console.log("userInfor",userInfor)
   
    try {
      const userData={
      email:formData.email,
      password:formData.password
    }
    const res=await login(userData).unwrap()
    dispatch(setCredentials(res))
    setFormData({
      email:"",
      password:""
    })
    console.log("res",res)
    if(res?.user?.role){
      navigate("/admin/dashboard")
    }
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

        /* ALL selectors scoped to .si-root — zero global side-effects */

        .si-root,
        .si-root *,
        .si-root *::before,
        .si-root *::after {
          box-sizing: border-box;
        }

        .si-root {
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

        .si-blob {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
        }
        .si-blob-1 {
          top: -120px;
          right: -80px;
          width: 480px;
          height: 480px;
          background: radial-gradient(circle, rgba(59,130,246,0.10) 0%, transparent 70%);
        }
        .si-blob-2 {
          bottom: -100px;
          left: -100px;
          width: 440px;
          height: 440px;
          background: radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%);
        }

        .si-card {
          width: 100%;
          max-width: 420px;
          background: #ffffff;
          border: 1px solid rgba(99,102,241,0.12);
          border-radius: 20px;
          padding: 40px 36px;
          box-shadow:
            0 4px 6px rgba(99,102,241,0.04),
            0 20px 48px rgba(99,102,241,0.10),
            inset 0 1px 0 rgba(255,255,255,0.9);
          position: relative;
          z-index: 1;
          animation: si-fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes si-fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .si-card::before {
          content: '';
          position: absolute;
          top: 0; left: 50%; transform: translateX(-50%);
          width: 55%;
          height: 2px;
          background: linear-gradient(90deg, transparent, #6366f1, #3b82f6, transparent);
          border-radius: 0 0 4px 4px;
        }

        .si-header {
          margin: 0 0 32px 0;
        }

        .si-eyebrow {
          font-family: 'Syne', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #6366f1;
          margin: 0 0 10px 0;
          padding: 0;
        }

        .si-title {
          font-family: 'Syne', sans-serif;
          font-size: 26px;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.2;
          margin: 0 0 8px 0;
          padding: 0;
        }

        .si-description {
          font-size: 14px;
          color: #64748b;
          font-weight: 400;
          line-height: 1.5;
          margin: 0;
          padding: 0;
        }

        .si-register-top {
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
        .si-register-top:hover { color: #4f46e5; }
        .si-register-top svg { transition: transform 0.2s; }
        .si-register-top:hover svg { transform: translateX(3px); }

        .si-fields {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .si-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .si-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .si-label {
          font-size: 12px;
          font-weight: 600;
          color: #334155;
          letter-spacing: 0.04em;
          margin: 0;
          padding: 0;
        }

        .si-forgot {
          font-size: 12px;
          font-weight: 500;
          color: #6366f1;
          background: none;
          border: none;
          padding: 0;
          margin: 0;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: color 0.2s;
        }
        .si-forgot:hover { color: #4f46e5; text-decoration: underline; }

        .si-input {
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
        .si-input::placeholder { color: #cbd5e1; }
        .si-input:focus {
          border-color: #6366f1;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
        }

        .si-input-wrap {
          position: relative;
        }

        .si-eye-btn {
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
        .si-eye-btn:hover { color: #4f46e5; }

        .si-submit {
          width: 100%;
          margin: 4px 0 0 0;
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
        .si-submit:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(99, 102, 241, 0.45);
        }
        .si-submit:active { transform: translateY(0); }

        .si-footer {
          margin: 24px 0 0 0;
          text-align: center;
          font-size: 13px;
          color: #94a3b8;
          padding: 0;
        }

        .si-footer-link {
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
        .si-footer-link:hover { color: #4f46e5; text-decoration: underline; }
      `}</style>

      <div className="si-root">
        <div className="si-blob si-blob-1" />
        <div className="si-blob si-blob-2" />

        <div className="si-card">
          <div className="si-header">
            <p className="si-eyebrow">Welcome back</p>
            <h1 className="si-title">Sign in to your account</h1>
            <p className="si-description">Good to see you again. Enter your details below.</p>
            <button className="si-register-top">
              Don't have an account? Register
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <form className="si-fields" onSubmit={handleSubmit}>
              {formError && (
                            <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                                {formError}
                            </p>
                        )}
            <div className="si-field">
              <label className="si-label">Email Address</label>
              <input className="si-input" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="jane@example.com" required />
            </div>

            <div className="si-field">
              <div className="si-label-row">
                <label className="si-label">Password</label>
                <button type="button" className="si-forgot">Forgot password?</button>
              </div>
              <div className="si-input-wrap">
                <input className="si-input" type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required />
                <button type="button" className="si-eye-btn" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="si-submit">Sign In</button>
          </form>

          <div className="si-footer">
            Don't have an account?{' '}
            <button className="si-footer-link">Create one</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Signinpage
