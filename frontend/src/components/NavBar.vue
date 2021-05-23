<template>
  <nav class="navbar navbar-light bg-light justify-content-between">
    <router-link to="/"
                 class="navbar-brand"
                 :class="activeTab('/home')">Home</router-link>
    <router-link v-if="role === 'admin'"
                 to="/admin"
                 class="navbar-brand"
                 :class="activeTab('/admin')">Admin</router-link>

    <template v-if="!homePage">
      <div class="ml-auto">
        <button class="btn">
          <router-link class="no-underline"
                       :class="activeTab('/profile')"
                       to="profile">Profile</router-link>
        </button>
        <button @click="logout()" class="btn">Logout</button>
      </div>
    </template>
    <div v-else>
      <div class="ml-auto">
        <button class="btn">
          <router-link class="no-underline text-dark"
                       to="/register">Register</router-link>
        </button>
        <button class="btn">
          <router-link class="no-underline text-dark"
                       to="/login">Login</router-link>
        </button>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "NavBar",
  props: {
    homePage: {
      type: Boolean,
      default: false
    },
    role: {
      type: String,
      default: ''
    }
  },
  computed: {
  },
  methods: {
    activeTab(param){
      if (this.$route.path === param) {
        return 'text-primary';
      }
        return 'text-dark';
    },
    logout() {
      this.$router.push("/");
      localStorage.clear();
    }
  }
}
</script>

<style scoped>
  .no-underline {
    text-decoration: none!important;
  }
</style>
