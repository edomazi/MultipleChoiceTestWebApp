<template>
  <div>
    <NavBar :role="user.role"/>
    <div class="container">
      <ul class="nav nav-tabs mt-3" id="myTab" role="tablist">
        <li class="nav-item">
          <a class="nav-link active"
             id="profile-info-tab"
             data-toggle="tab"
             href="#profile"
             role="tab"
             aria-controls="home"
             aria-selected="true">Profile Info</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" id="statistics-tab" data-toggle="tab"
             href="#statistics" role="tab" aria-controls="profile"
             aria-selected="false">Statistics</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" id="charts-tab" data-toggle="tab"
             href="#charts" role="tab" aria-controls="contact"
             aria-selected="false">Charts</a>
        </li>
      </ul>
      <div class="tab-content" id="myTabContent">
        <div class="tab-pane fade show active" id="profile" role="tabpanel" aria-labelledby="profile-info-tab">
          <div class="card mt-3 text-left p-3">
          <p> <span>Name:</span> <span v-html="user.name"></span></p>
          <p> Email: {{user.email}}</p>
          </div>
        </div>
        <div class="tab-pane fade" id="statistics" role="tabpanel" aria-labelledby="statistics-tab">
          <div class="card mt-3 text-left p-3">
            <div class="row">
              <div class="col-4">
                Computer Science:
                <ul>
                  <li>
                    Total tests done: {{computerScience.length}}
                  </li>
                  <li>
                    Average easy score: {{calculateAverageScore(computerScience, 'easy')}}
                  </li>
                  <li>
                    Average medium score: {{calculateAverageScore(computerScience, 'medium')}}
                  </li>
                  <li>
                    Average hard score: {{calculateAverageScore(computerScience, 'hard')}}
                  </li>
                </ul>
              </div>
              <div class="col-4">
                Math
                <ul>
                  <li>
                    Total tests done: {{math.length}}
                  </li>
                  <li>
                    Average easy score: {{calculateAverageScore(math, 'easy')}}
                  </li>
                  <li>
                    Average medium score: {{calculateAverageScore(math, 'medium')}}
                  </li>
                  <li>
                    Average hard score: {{calculateAverageScore(math, 'hard')}}
                  </li>
                </ul>
              </div>
              <div class="col-4">
                Custom quiz
                <ul>
                  <li>
                    Total tests done: {{customQuiz.length}}
                  </li>
                  <li>
                    Average score: {{calculateCustomQuizScore()}}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="tab-pane fade" id="charts" role="tabpanel" aria-labelledby="charts-tab">
          <template v-if="computerScience.length >= 1">
            <Chart :quizData="computerScience"
                   title="Computer science"
                   :id=1 />
          </template>
          <template v-if="math.length >= 1">
            <Chart :quizData="math"
                   title="Math"
                   :id=2 />
          </template>
          <template v-if="customQuiz.length >= 1">
            <Chart :quizData="customQuiz"
                   title="Custom Quiz"
                   :id=3 />
          </template>
        </div>
      </div>
    </div>
    <Footer/>
  </div>
</template>

<script>
import axios from "axios"
import NavBar from "@/components/NavBar";
import Chart from "@/components/Chart";
import Footer from "@/components/Footer";
export default {
  name: "Profile",
    components: {Footer, Chart, NavBar},
    data() {
    return{
      user: {},
      computerScience: [],
      math: [],
      customQuiz: [],
}
  },
  mounted() {
    if(!localStorage.getItem('token')) {
        this.$router.push('/login')
    } else {
        this.getProfile()
    }
  },
  methods: {
    async getProfile() {
     await axios.post('http://localhost:3000/getProfile', {
        token: localStorage.getItem('token'),
      }).then((response) => {
        this.user = response.data.user;
         response.data.user.quizResults.forEach((item) => {
            if (item.quizName === 'computer science') {
              this.computerScience.push(item)
            }
            if(item.quizName === 'math') {
              this.math.push(item)
            }
            if(item.quizName === 'custom quiz') {
              this.customQuiz.push(item)
            }
        })
      });
    },
   calculateAverageScore(quizName, quizDiff){
      if(quizName.length){
          let avg = 0;
          quizName.forEach((item) => {
              if(item.quizDifficulty === quizDiff) {
                  avg += item.percentage;
              }
          })
          return avg / quizName.length + '%';
      }
      return ' - ';
    },
    calculateCustomQuizScore() {
      let avg = 0;
      if(this.customQuiz.length) {
        this.customQuiz.forEach((item) => {
          avg += item.percentage;
        })
          return avg / this.customQuiz.length + '%';
      }
      return ' - ';
    }
  },

}
</script>

<style scoped>
.nav-link {
  color: black!important;
}
.nav-link.active {
  color: #0275d8 !important;
}
</style>
