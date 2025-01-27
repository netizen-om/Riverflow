import { useAuthStore } from '@/store/Auth'
import React, { useState } from 'react'
function loginPage() {

    const {login} = useAuthStore()
    
        const [isLoading, setIsLoading] = useState(false)
        const [error, setError] = useState("")

        const handelSubmit = async(e : React.FormEvent<HTMLFormElement>) => {
            e.preventDefault()

            //collect data
            const formData = new FormData(e.currentTarget)
            const email = formData.get("email")
            const password = formData.get("password")

            //validation
            if(!email || !password){
                setError(() => "Please fill all field")
                return
            }

            //handel loading and error
            setIsLoading(() => true)
            setError(() => "")
            
            //login => store
            const loginResponse = await login(email.toString(), password.toString())
            
            if(loginResponse.error){
                setError(() => loginResponse.error!.message)
            }
            setIsLoading(() => false)
        }
        
  return (
    <div></div>
  )
}

export default loginPage