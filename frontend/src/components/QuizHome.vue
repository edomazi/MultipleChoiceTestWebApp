<template>
  <div>
    <NavBar :homePage=true />
    <div class="container mt-3">
      <h4>
        Welcome to the Quiz App.
        <p>Feel free to do a sample quiz to test your knowledge!</p>
      </h4>
      <div class="card mt-4 p-4">
        <div class="card-body">
          <template v-if="questions.length">
            <h5 class="card-title">{{(questions[nowQuestion].question)}}</h5>
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
            <div class="loader loader--style2" title="1">
              <svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                   width="40px" height="40px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">
              <path fill="#000" d="M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z">
                <animateTransform attributeType="xml"
                                  attributeName="transform"
                                  type="rotate"
                                  from="0 25 25"
                                  to="360 25 25"
                                  dur="0.6s"
                                  repeatCount="indefinite"/>
                </path>
              </svg>
            </div>
          </template>
        </div>
      </div>
      <div v-if="showResults"
           class="card mt-3 p-3">
        <h4>
          You completed the test with {{correctAnswers}} / {{correctAnswers + wrongAnswers}} correct answers!
        </h4>
        <p>
          If you'd like to do more quiz and track you progress over time feel free to
          <router-link to="/register"> Register </router-link>
        </p>
      </div>
    </div>
    <Footer/>
  </div>
</template>

<script>
import axios from 'axios'
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
export default {
  name: 'QuizHome',
    components: {Footer, NavBar},
    data() {
    return {
      questions: [],
      nowQuestion: 0,
      userAnswer: '',
      showResults: false,
      correctAnswers: 0,
      wrongAnswers: 0,
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
    },
    async mounted() {
      if(localStorage.getItem('token')) {
          await this.$router.push('/home')
      } else {
        await axios.get('http://192.168.100.6:3000/')
            .then((response) => {
                this.questions = response.data.questions;
            }).catch((err) => {
                console.log(err);
            })
      }
    },
    methods: {
      checkAnswer() {
        if (this.questions[this.nowQuestion].correct_answer === this.userAnswer) {
          this.correctAnswers += 1;
        } else {
          this.wrongAnswers += 1;
        }
      },
      changeQuestion(value) {
        this.nowQuestion += value;
      },
      finishTest() {
        this.showResults = true;
      }
    },
}
</script>

<style scoped>
svg path,
svg rect{
  fill: #0060db;
}
</style>
