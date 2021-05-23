<template>
  <div class="element">
    <div class="d-flex align-items-center vh-100">
      <div class="container text-center col-lg-3 col-md-6 col-sm-6">
        <h1 class="mb-5 text-monospace.">Login</h1>
        <div v-if="message"
             class="alert alert-danger" role="alert">
          {{message}}
        </div>
        <div class="border border-dark p-5">
          <form>
            <div class="form-group text-black">
              <label for="InputEmail1">Email address</label>
              <input type="email" class="form-control" id="InputEmail1" aria-describedby="emailHelp" placeholder="Email"
                     v-model="email" required>
            </div>
            <div class="form-group text-black">
              <label for="InputPassword1">Password</label>
              <input type="password" class="form-control" id="InputPassword1" placeholder="*********"
                     v-model="password" required>
            </div>
            <button @click.prevent="login()"
                    class="btn btn-dark rounded-lg mt-2"
                    :disabled="computeFields">
                    Login</button>
            <h5 class="mt-4 mb-n3">
              <u>Or
                <router-link class="text-primary font-weight-bold" to="/register"> Register</router-link>
                for FREE if you haven't already!
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
    name: "Login",
    data() {
        return {
            email: '',
            password: '',
            message: '',
        };
    },
    computed: {
        computeFields() {
            return !(this.email.length && this.password.length && this.email.includes('@'));
        }
    },
    methods: {
        async login() {
            this.message = '';
            let response = await axios.post('http://localhost:3000/login', {
                email: this.email,
                password: this.password,
            });
            if (response.data.code) {
                localStorage.setItem('token', response.data.token);
                await this.$router.push( '/home' );
            } else {
                this.message = response.data.message;
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
  border: 2px solid black !important;
}
</style>
