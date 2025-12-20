import React, { createContext, useEffect, useState } from 'react';
import { auth, getUserProfile } from '../firebase';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';

export const AuthContext = createContext({ user: null, profile: null, loading: true });

export function AuthProvider({ children }){
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    let mounted = true;
    const unsub = onAuthStateChanged(auth, async (u)=>{
      if(!mounted) return;
      if(u){
        setUser(u);
        try{
          const p = await getUserProfile(u.uid);
          setProfile(p);
        }catch(err){
          setProfile(null);
        }
      }else{
        setUser(null);
        setProfile(null);
      }
      if(mounted) setLoading(false);
    });
    return ()=>{ mounted=false; unsub(); }
  },[]);

  const refreshProfile = async () => {
    if (!auth.currentUser) {
      setProfile(null);
      return null;
    }
    try {
      const p = await getUserProfile(auth.currentUser.uid);
      setProfile(p);
      return p;
    } catch {
      setProfile(null);
      return null;
    }
  };

  const signOut = async ()=>{
    await firebaseSignOut(auth);
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}
