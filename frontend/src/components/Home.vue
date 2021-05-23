<template>
  <div>
    <NavBar :role="user.role"/>
    <div class="container mt-4">
      <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Quiz Check</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              Are you sure you want to start the following test:
              <p>
                {{this.selectQuiz}} - {{this.selectDifficulty}}
              </p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              <button @click="getQuiz()"
                      type="button"
                      class="btn btn-primary"
                      data-dismiss="modal"
                      >Start!</button>
            </div>
          </div>
        </div>
      </div>

      <div class="container">
        <div class="border border-primary border-3 p-3 rounded">
          <h5>Welcome to the Quiz App, test you ability and knowledge in some important fields!</h5>
          <h5> Good Luck! </h5>
        </div>
        <div class="card mt-5 p-3">
          <p class="text-left">
            <select v-model="selectQuiz">
              <option value="" selected disabled hidden> Select a test</option>
              <option>Computer Science</option>
              <option>Math</option>
              <option>Custom Quiz</option>
            </select>
            <br>
            <template v-if="selectQuiz === 'Custom Quiz'">
            <div class="mt-3">
              <span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2.033 16.01c.564-1.789 1.632-3.932 1.821-4.474.273-.787-.211-1.136-1.74.209l-.34-.64c1.744-1.897 5.335-2.326 4.113.613-.763 1.835-1.309 3.074-1.621 4.03-.455 1.393.694.828 1.819-.211.153.25.203.331.356.619-2.498 2.378-5.271 2.588-4.408-.146zm4.742-8.169c-.532.453-1.32.443-1.761-.022-.441-.465-.367-1.208.164-1.661.532-.453 1.32-.442 1.761.022.439.466.367 1.209-.164 1.661z"/></svg>
                In this section you will be able to do a quiz loaded buy an admin. Those quiz can contain questions from multiple fields and have multiple difficulty levels.
                If u are sure <button @click.prevent="getUploadedFiles()" class="btn btn-transparent btm-sm custom-allign"> click here </button> to load the list with quiz
              </span>
              <ul v-for="(file, index) in allFiles" :key="index"
                   class="mt-2">
                <li>{{file.replace('.json', '')}}
                  <button class="btn btn-info btn-sm"
                          @click.prevent="getContent(file)"
                          :disabled="disableStartQuiz"
                          >Start quiz</button>
                </li>
              </ul>
            </div>
          </template>
          <select v-else-if="selectQuiz && selectQuiz !== 'Custom Quiz'" class="mt-3" v-model="selectDifficulty" style="width: 20%">
            <option value="" selected disabled hidden> Select the difficulty</option>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
          </p>
          <p>
            <button v-if="selectDifficulty"
                    type="button"
                    class="btn btn-primary"
                    data-toggle="modal"
                    data-target="#exampleModal"
                    :disabled="disableStartQuiz">
              Start quiz
            </button>
          </p>
        </div>
        <template v-if="showQuiz">
          <div class="card mt-3 p-3">
            <div class="card-body">
              <template v-if="questions.length">
              <h5 class="card-title">{{decrypt(questions[nowQuestion].question)}}</h5>
                <div class="text-left">
                  <template v-for="(answers, index) in questions[nowQuestion].answers">
                    <input :key="answers.id" type="radio" class="mr-2" :id="index" :value="answers" v-model="userAnswer">
                    <label :key="answers.id" :for="index">{{answers}}</label>
                    <br :key="answers.id"/>
                  </template>
                </div>
              <button @click="[checkAnswer(), changeQuestion(+1)]"
                      class="btn btn-primary"
                      :style="'display: ' + computeLastQuestion">Next</button>
              <button @click.prevent="[checkAnswer(), finishTest()]"
                      class="btn btn-danger"
                      :style="'display: ' + computeFinish">Finish</button>
              </template>
              <template v-else>
                No questions yet
              </template>
            </div>
          </div>
        </template>
        <template v-if="showResults">
          <div class="border border-3 mt-3 p-3"
               :class="computeBorder">
            <h2 v-html="computeResult">
            </h2>
            <h5>
              You completed the test with {{correctAnswers}} / {{correctAnswers + wrongAnswers}} correct answers!
            </h5>
          </div>
        </template>
      </div>
    </div>
    <Footer/>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar";
const axios = require('axios').default;
import utils from "../../utils/utils";
import Footer from "@/components/Footer";

export default {
  name: 'Home',
    components: {Footer, NavBar},
    data() {
    return {
      userAnswer: [],
      nowQuestion: 0,
      questions: [],
      message: null,
      showQuiz: false,
      disableStartQuiz: false,
      selectQuiz: '',
      selectDifficulty: '',
      correctAnswers: 0,
      wrongAnswers: 0,
      showResults: false,
      user: {},
      allFiles: [],
    }
  },
  mounted() {
      if(!localStorage.getItem('token')) {
        this.$router.push('/login')
      } else {
        this.questions = [];
        this.getProfile()
      }
  },
  computed: {
      computeLastQuestion() {
        if (this.questions.length - 1 === this.nowQuestion) {
            return 'none';
        }
        return '';
      },
      computeFinish() {
          if (this.questions.length - 1 === this.nowQuestion) {
              return '';
          }
          return 'none';
      },
      computeResult() {
          const percentage = Math.round((this.correctAnswers / (this.correctAnswers + this.wrongAnswers)) * 100);
          if (percentage < 50) {
              return '<span class="text-danger">You Failed</span>'
          }
          return '<span class="text-success">Congratulation!</span>'
      },
      computeBorder() {
          const percentage = Math.round((this.correctAnswers / (this.correctAnswers + this.wrongAnswers)) * 100);
          if (percentage < 50) {
              return 'border-danger'
          }
          return 'border-success'
      }
  },
  methods: {
    getQuiz() {
      this.showResults = false;
      this.questions = [];
      this.correctAnswers = 0;
      this.wrongAnswers = 0;
      axios.post('http://localhost:3000/getQuiz', {
          quizName: this.selectQuiz.toLowerCase(),
          quizDifficulty: this.selectDifficulty.toLowerCase(),
          token: localStorage.getItem('token'),
      }).then((response) => {
          this.questions = response.data.questions;
      });
      this.nowQuestion = 0;
      this.showQuiz = true;
      this.disableStartQuiz = true;
    },
    getProfile() {
      axios.post('http://localhost:3000/getProfile', {
          token: localStorage.getItem('token'),
      }).then((response) => {
          this.user = response.data.user;
      });
    },
    changeQuestion(value) {
      this.nowQuestion += value;
    },
    finishTest() {
      this.showQuiz = false;
      this.showResults = true;
      this.disableStartQuiz = false;
      axios.post('http://localhost:3000/saveQuizResults', {
          token: localStorage.getItem('token'),
          quizName: this.selectQuiz.toLowerCase(),
          quizDifficulty: this.selectDifficulty.toLowerCase(),
          percentage: Math.round((this.correctAnswers / (this.correctAnswers + this.wrongAnswers)) * 100)
      })
    },
    checkAnswer() {
        if (this.decrypt(this.questions[this.nowQuestion].correct_answer) === this.userAnswer) {
          this.correctAnswers += 1;
        } else {
          this.wrongAnswers += 1;
        }
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
        this.nowQuestion = 0;
        this.showQuiz = true;
        this.disableStartQuiz = true;

      });
    },
    decrypt(value) {
      return utils.decryptWithAES(value);
    }
  },
}
</script>
<style scoped>
.border-3 {
  border-width:3px !important;
}
.custom-allign {
  margin-top: -6px;
  margin-left: -10px;
  margin-right: -10px;
  text-decoration: underline;
  text-decoration-color: red;
}
</style>
