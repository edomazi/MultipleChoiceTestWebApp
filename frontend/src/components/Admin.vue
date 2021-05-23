<template>
  <div>
    <NavBar :role="user.role" />
    <div class="container mt-3">
      <div class="card p-3">
        <div class="table-responsive">
          <table class="table">
            <thead class="thead-dark">
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Role</th>
            </tr>
            </thead>
            <tbody>
              <tr v-for="(user, index) in allUsers" :key="index">
                <td>
                  {{user.name}}
                </td>
                <td>
                  {{user.email}}
                </td>
                <td>
                  {{user.role}}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="card mt-3 p-3">
        <form enctype="multipart/form-data">
          <div>
            <label>Upload File:</label>
            <input type="file"
                   ref="file"
                   accept="application/json"
                   @change="onSelect"/>
          </div>
          <button class="btn btn-primary btn-sm"
                  @click.prevent="submitFile()"
                  :disabled="disableSubmit">Submit</button>
        </form>
        {{message}}
      </div>
      <div class="card mt-3 p-3">
        <p>
          <button @click.prevent="getUploadedFiles()" class="btn btn-primary mb-3"> Get uploaded quiz</button>
        </p>
        <div v-for="(file, index) in allFiles" :key="index"
              class="mt-2">
          <span>{{file}}
            <button class="btn btn-info" @click.prevent="getContent(file)">Get File Content</button>
            <button class="btn btn-danger ml-2" @click.prevent="deleteFile(file)">Delete</button>
          </span>
        </div>
      </div>
      <div v-if="questions.length"
           class="card mt-3 p-3">
        {{questions}}
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import NavBar from "@/components/NavBar";
import axios from "axios";
import Footer from "@/components/Footer";
export default {
  name: "Admin",
  data() {
    return {
      user: {},
      allUsers: [],
      file: '',
      message: '',
      allFiles: [],
      questions: ''
    }
  },
  components: {
    Footer,
    NavBar
  },
  mounted() {
    if(!localStorage.getItem('token')) {
        this.$router.push('/login')
    } else {
        this.getProfile()
        this.getAllUsers()
    }
  },
  computed: {
      disableSubmit() {
          return !(this.file && this.file.name);
      },
  },
  methods: {
    getProfile(){
      axios.post('http://localhost:3000/getProfile', {
          token: localStorage.getItem('token'),
      }).then((response) => {
          this.user = response.data.user;
      });
    },
    getAllUsers() {
      axios.post('http://localhost:3000/getAllUsers', {
          token: localStorage.getItem('token'),
      }).then((response) => {
          this.allUsers = response.data.allUsers;
      });
    },
    onSelect() {
        this.file = this.$refs.file.files[0];
        console.log(this.file.name);
    },
    async submitFile() {
        const formData = new FormData();
        formData.append('file', this.file);
        formData.append('token', localStorage.getItem('token'));
        await axios.post('http://localhost:3000/uploadFile', formData)
            .then((response) => {
                this.message = response.data.message;
            }).catch((err) => {
              this.message = err;
            });
    },
    getUploadedFiles(){
      axios.post('http://localhost:3000/getUploadedFiles', {
          token: localStorage.getItem('token'),
      }).then((response) => {
          this.allFiles = response.data.allFiles;
      });
    },
    getContent(fileName) {
        axios.post('http://localhost:3000/getFileUpdatedContent', {
            token: localStorage.getItem('token'),
            fileName: fileName,
        }).then((response) => {
            this.questions = response.data.questions;
        });
    },
    deleteFile(fileName) {
      axios.post('http://localhost:3000/deleteFile', {
          token: localStorage.getItem('token'),
          fileName: fileName,
      }).then((response) => {
          this.message = response.data.message;
          this.getUploadedFiles()
      });
    }
  }
}
</script>

<style scoped>

</style>
