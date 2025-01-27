import { useAuthStore } from '@/store/Auth'
import React, { useState } from 'react'

function registerPage() {
    const {createAccount , login} = useAuthStore()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async(e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        //collect data
        const formData = new FormData(e.currentTarget)
        const firstname = formData.get("fistname")
        const lastname = formData.get("lastname")
        const email = formData.get("email")
        const password = formData.get("password")

        //validate
        if(!firstname || !lastname || !email || !password){
            setError(() => "Please fill out all the field")
            return
        }

        //call the store
        setIsLoading(true)
        setError("") 
        
        const response = await createAccount(
          `${firstname} ${lastname}`,
          email.toString(),
          password.toString()
        )

        if(response.error) {
          setError(() => response.error!.message)
        } else {
          const loginResponse = await login(email.toString(), password.toString());
            if (loginResponse.error) {
                setError(() => loginResponse.error!.message);
            }
        }

        setIsLoading(() => false)

    }

  return (
    <div>
      {error && (
        <p>{error}</p>
      )}

      <form onSubmit={handleSubmit}>
        
      </form>

    </div>
  )
}

export default registerPage