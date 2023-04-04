import { useState, useEffect, useRef } from 'react'
import { createUserWithEmailAndPassword, 
         signInWithEmailAndPassword, 
         signInWithPopup,
         signOut } from 'firebase/auth'
import { auth, googleProvider } from '../config/firebase'

export const Auth = () => {
    const [email, setEmail] = useState('')
    const inputEl = useRef(null);
    const [password, setPassword] = useState('')    

    /* fakeemail@gmail.com  fakepassword */
    const signUp = async () => {
        try {            
            await createUserWithEmailAndPassword(auth, email, password)
        }
        catch (err) {
            console.log(err)
        }
    }
    const signIn = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password)
            console.log(auth?.currentUser)
        }
        catch (err) {
            console.log(err)
        }
    }
    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider)
            console.log(auth?.currentUser)
        }
        catch (err) {
            console.log(err)
        }
    }
    const logoutOut = async () => {
        try {
            await signOut(auth)
        }
        catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        inputEl.current.focus()
    }, [])
    return (
            <div>
                <div>
                    <div>
                        <input type='text' placeholder='email...' ref={inputEl} 
                            onChange={e => setEmail(e.target.value)}></input>
                    </div>
                    <div>
                        <input type='password' placeholder='password...' 
                            onChange={e => setPassword(e.target.value)}></input>
                    </div>
                    <div>
                        <button onClick={signIn}>Sign In</button>
                        <div>
                            <label>if you do not have an account, please click </label><button onClick={signUp}>Sign Up</button>
                        </div>                        
                    </div>
                </div>
                <div>
                    <label>or </label><button onClick={signInWithGoogle}>Sign In With Google</button> 
                </div>
                <div>
                    { auth?.currentUser && <button onClick={logoutOut}>Sign Out</button> }
                </div>
            </div>
    )
}