import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/home.vue'       // головна сторінка
import Register from '../components/register.vue' // сторінка реєстрації
import Profile from '../components/profile.vue'
import UserProfile from '../components/userProfile.vue'
import CreatePost from '../components/create-post.vue'
import PostViews from '../components/postViews.vue'
import Login from '../components/login.vue'
import Comments from '../components/comments.vue'

const routes = [
  { path: '/', redirect: '/home' },

  { path: '/home', name: 'Home', component: Home },          // маршрут головної
  { path: '/register', name: 'Register', component: Register }, // маршрут реєстрації
  { path: '/login', name: 'Login', component: Login }, // маршрут входу
  { path: '/profile', name: 'Profile', component: Profile }, // маршрут профілю
  { path: '/create-post', name: 'CreatePost', component: CreatePost}, // Маршрут для створення посту
  { path: '/posts/:id', name: 'PostViews', component: PostViews}, // Маршрут для перегляду посту
  { path: '/posts/:id/comments', name: 'Comments', component: Comments}, // Маршрут для коментарів
  { path: '/profile/:id', name: 'UserProfile', component: UserProfile }, // Маршрут профілю юзера
]

const router = createRouter({
  history: createWebHistory(),
  routes
})


// Перевірка авторизації перед кожним переходом
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token")

  // маршрути, які можна відвідувати без авторизації
  const publicPages = ['/register', '/login', '/home', '/posts/:id', '/profile/:id' ]

  // якщо маршрут не публічний
  const authRequired = !publicPages.includes(to.path)

  if (authRequired && !token) {
    alert("Спочатку авторизуйтеся")
    return next('/register') // якщо не авторизований → на register
  }


  next()
})

export default router
