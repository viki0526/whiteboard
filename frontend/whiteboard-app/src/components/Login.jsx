import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
    const { signInWithGoogle } = useAuth();

    return (
        <div>
            <h1>Login</h1>
            <button href='/' onClick={signInWithGoogle}>Sign in with Google</button>
        </div>
    );
}
