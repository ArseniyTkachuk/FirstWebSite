<template>
  <div class="auth">
    <h2>Login</h2>

    <input type="email" v-model="email" placeholder="Email">
    <p v-if="errors.email" class="error">{{ errors.email }}</p>
    
    <div class="password-wrapper">
        <input 
        :type="showPassword ? 'text' : 'password'" 
        v-model="password" 
        placeholder="Password"
        >
        <span class="eye" @click="showPassword = !showPassword">
        <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 13a5.5 5.5 0 110-11 5.5 5.5 0 010 11zm0-9a3.5 3.5 0 100 7 3.5 3.5 0 000-7z"/>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 13c-3.04 0-5.64-1.73-7-4.33 1.36-2.6 3.96-4.33 7-4.33 3.04 0 5.64 1.73 7 4.33-1.36 2.6-3.96 4.33-7 4.33zm0-9a5.5 5.5 0 100 11 5.5 5.5 0 000-11zm0 9a3.5 3.5 0 110-7 3.5 3.5 0 010 7z"/>
        </svg>
      </span>
    </div>

    <p v-if="errors.password" class="error">{{ errors.password }}</p>
    
    <button @click="login">Login</button>
    
    <p v-if="result" class="error">{{ result }}</p>
    
    <!-- Кнопка для переходу на реєстрацію -->
    <button class="register-btn" @click="$router.push('/register')">Немає акаунту? Зареєструватися</button>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      showPassword: false,
      email: "",
      password: "",
      result: null, // помилка сервера
      errors: {}    // помилки валідації
    }
  },

  methods: {
    async login() {
      this.result = null;
      this.errors = {};

      try {
        const res = await axios.post("http://localhost:4444/auth/login", {
          email: this.email,
          password: this.password
        });

        localStorage.setItem("token", res.data.token);
        this.$router.push('/home');

      } catch (err) {
        console.error(err);

        if (Array.isArray(err.response?.data)) {
          err.response.data.forEach(e => {
            this.errors[e.path] = e.msg;
          });
        }

        if (err.response?.data?.message) {
          this.result = err.response.data.message;
        }
      }
    }
  }
}
</script>

<style scoped>
.auth {
  width: 360px;
  margin: 100px auto;
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background-color: #1e1e2f;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.5);
  color: #fff;
  text-align: center;
}

.auth input {
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #444;
  background-color: #2c2c3f;
  color: #fff;
  font-size: 15px;
  outline: none;
}

.auth input::placeholder {
  color: #aaa;
}

.auth input:focus {
  border-color: #6b8cff;
  box-shadow: 0 0 6px rgba(107, 140, 255, 0.6);
}

.password-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-wrapper input {
  padding-right: 40px;
}

.password-wrapper .eye {
  position: absolute;
  right: 12px;
  cursor: pointer;
  color: #aaa;
}

.password-wrapper .eye svg {
  display: block;
  width: 20px;
  height: 20px;
  color: inherit;
}

.password-wrapper .eye:hover {
  color: #aaa;
}

.auth button {
  padding: 12px;
  background: #6b8cff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  color: #fff;
  cursor: pointer;
}

.auth button:hover {
  background: #5a75e6;
}

.register-btn {
  padding: 12px;
  background: #44475a;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  color: #fff;
  cursor: pointer;
  margin-top: 10px;
  transition: 0.2s;
}

.register-btn:hover {
  background: #6b8cff;
}

.error {
  color: #ff6b6b;
  font-size: 14px;
  margin: -8px 0 4px 0;
  text-align: left;
}
</style>
