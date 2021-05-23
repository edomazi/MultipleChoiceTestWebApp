<template>
  <div class="element">
    <div class="d-flex align-items-center vh-100">
      <div class="container text-center col-lg-3 col-md-6 col-sm-8">
        <h1 class="mb-5 text-monospace.">Sign up</h1>
        <div v-if="message"
             class="alert alert-primary" role="alert">
          {{message}}
        </div>
        <div class="border border-dark p-5">
          <form>
            <div class="form-group text-black">
              <label for="username">Name</label>
              <input type="text" class="form-control" id="username" placeholder="Name" v-model="name" required>
            </div>
            <div class="form-group text-black">
              <label for="InputEmail1">Email address</label>
              <input type="email" class="form-control" id="InputEmail1" aria-describedby="emailHelp" placeholder="Email" v-model="email" required>
            </div>
            <div class="form-group text-black">
              <label for="InputPassword1">Password</label>
              <input type="password" class="form-control" id="InputPassword1" placeholder="*********" v-model="password" required>
            </div>
            <button @click.prevent="register()"
                    class="btn btn-dark rounded-lg mt-2"
                    :disabled="computeFields">Sign up</button>
            <h5 class="mt-4 mb-n3 ">
              <u>Or if you already have an account
                <router-link class=" font-weight-bold" to="/login">Login</router-link>
              </u>
            </h5>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const axios = require('axios').default;

export default {
  name: "Signup",
  data() {
    return {
      name: '',
      email: '',
      password: '',
      message: '',
    };
  },
  computed: {
    computeFields() {
        return !(this.name.length && this.email.length && this.password.length && this.email.includes('@'));
    }
  },
  methods: {
    async register() {
        let response = await axios.post('http://localhost:3000/register', {
            name: this.name,
            email: this.email,
            password: this.password,
        });
        this.message = response.data.message;
        if (response.data.code) {
            this.name = '';
            this.email = '';
            this.password = '';
        }
    }
  }
}
</script>

<style scoped>
  .element {
    background-image: url('../../public/images/backgroundlogin.jpg');
    max-width: 100%;
    height: auto;
    min-height: 100%;
    background-position: center;
    background-size: cover;
  }
  .border {
    border: 2px solid black!important;
  }
</style>
