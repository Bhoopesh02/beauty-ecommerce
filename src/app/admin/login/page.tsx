"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Dummy login
    router.push("/admin/dashboard");
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.logo}>
          <h2>DERRUME</h2>
          <p>Admin Portal</p>
        </div>
        
        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@derrume.com"
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          
          <button type="submit" className={styles.loginBtn}>
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
