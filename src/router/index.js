import { createRouter, createWebHistory } from 'vue-router'

import LoginComponent from '@/modules/auth/LoginComponent.vue'
import RegisterComponent from '@/modules/auth/RegisterComponent.vue'
import Profile from '@/components/Profile.vue'
import HelloWorld from '@/components/HelloWorld.vue'
import GameContextList from '@/components/game/GameContextList.vue'
import GameContext from '@/components/game/GameContext.vue'
import ConnectGameContext from '@/components/game/ConnectGameContext.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HelloWorld
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginComponent
    },
    {
      path: '/register',
      name: 'Register',
      component: RegisterComponent
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile
    },
    {
      path: '/games',
      name: 'GameContextList',
      component: GameContextList
    },
    {
      path: '/games/:id',
      name: 'GameContext',
      component: GameContext
    },
    {
      path: '/connect/:id',
      name: 'ConnectGameContext',
      component: ConnectGameContext
    }
    // ,
    // {
    //   path: '/logout',
    //   name: 'Logout',
    //   component: LogoutComponent
    // }
  ]
})

router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/register', '/home']
  const authRequired = !publicPages.includes(to.path)
  const loggedIn = localStorage.getItem('user')

  // trying to access a restricted page + not logged in
  // redirect to login page
  if (authRequired && !loggedIn) {
    next('/login')
  } else {
    next()
  }
})
export default router
