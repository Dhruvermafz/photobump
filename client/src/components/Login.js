import React, {useEffect} from 'react'
import {useNavigate} from "react-router-dom"
import { motion } from "framer-motion"
import {FcGoogle} from "react-icons/fc"
import {useSignInWithGoogle} from "react-firebase-hooks/auth"
import backgroundVideo from "../assets/background.mp4"

const Login = () => {
    const navigate = useNavigate();
    const [signInWithGooge, userCred, loading, error] = useSignInWithGoogle(auth)

    const createUserDoc  =async (user) => {
        try {
            const doc  = {
                _id: user?.uid,
                _type: "user",
                userName: user?.displayName,
                image: user?.photoURL,
            }
        } catch (error) {
            
        }
    }
  return (
    <div>
      
    </div>
  )
}

export default Login
