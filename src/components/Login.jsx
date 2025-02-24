import React, {useState} from 'react'
import { Link, useNavigate } from "react-router-dom"
import { login as authLogin } from "../store/authSlice"
import {Button, Input, Logo} from "./index"
import { useDispatch } from 'react-redux'
import authService from "../appwrite/auth"
import {useForm} from "react-hook-form"

function Login() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {register, handleSubmit} = useForm()
    const [error, setError] = useState("")

    const login = async(data) => {
        //console.log("Data", data);
        console.log("Hello world");
        
        setError("")
        try {
            const session = await authService.login(data) 
            if (session) {
                const userData = await authService.getCurrentUser()
                if (userData) {
                    dispatch(authLogin(userData))
                }
                navigate("/")
            } 
        } catch (error) {
            setError(error.message)
        }
    }
  return (
    <div className="flex items-center justify-center w-full min-h-screen p-4 sm:p-6 lg:p-8">
  <div className="mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-6 sm:p-10 border border-black/10">
    {/* Logo */}
    <div className="mb-4 flex justify-center">
      <span className="inline-block w-full max-w-[100px]">
        <Logo />
      </span>
    </div>

    {/* Heading */}
    <h2 className="text-center text-xl sm:text-2xl font-bold leading-tight">
      Sign in to your account
    </h2>

    {/* Description */}
    <p className="mt-2 text-center text-sm sm:text-base text-black/60">
      Don&apos;t have any account?&nbsp;
      <Link
        to="/signup"
        className="font-medium text-primary transition-all duration-200 hover:underline"
      >
        Sign Up
      </Link>
    </p>

    {/* Error Message */}
    {error && (
      <p className="text-red-600 mt-4 sm:mt-8 text-center text-sm sm:text-base">
        {error}
      </p>
    )}

    {/* Form */}
    <form onSubmit={handleSubmit(login)} className="mt-6 sm:mt-8">
      <div className="space-y-4 sm:space-y-5">
        {/* Email Input */}
        <Input
          label="Email: "
          placeholder="Enter your email"
          type="email"
          {...register("email", {
            required: true,
            validate: {
              matchPatern: (value) =>
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                "Email address must be a valid address",
            },
          })}
        />

        {/* Password Input */}
        <Input
          label="Password: "
          placeholder="Enter your password"
          type="password"
          {...register("password", {
            required: true,
          })}
        />

        {/* Submit Button */}
        <Button type="submit" className="w-full">
          Sign in
        </Button>
      </div>
    </form>
  </div>
</div>
  )
}

export default Login