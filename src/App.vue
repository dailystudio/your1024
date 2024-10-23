<template>
  <div class="app">
    <header class="header">
      <h1>1024 Game</h1>
    </header>
    <main class="main">
      <div class="numbers-container">
        <div
          v-for="number in numbers"
          :key="number"
          class="number-card"
          :style="{ backgroundColor: isNumberUsed(number) ? 'orange' : '', color: isNumberUsed(number) ? 'white' : 'grey' }"
        >
          {{ number }}
        </div>
      </div>
      <div class="input-container">
        <input type="text" v-model="expression" placeholder="Enter expression" @input="checkExpression">
        <button @click="submit">Submit</button> 
      </div>
      <div class="result-container" v-if="expression">
        Result: {{ calculatedResult }}
      </div>
      <div class="time-taken" v-if="timeTaken">
        Time taken: {{ timeTaken }} seconds
      </div>
    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      numbers: this.getRandomFactors(),
      expression: '',
      calculatedResult: '',
      startTime: new Date(), 
      timeTaken: null
    };
  },
  methods: {
    getRandomFactors() {
      const factors = [2, 4, 8, 16, 32, 64, 128, 256];
      const selectedFactors = [];

      while (selectedFactors.length < 4) {
        const randomIndex = Math.floor(Math.random() * factors.length);
        const randomFactor = factors[randomIndex];

        if (!selectedFactors.includes(randomFactor)) {
          selectedFactors.push(randomFactor);
        }
      }

      return selectedFactors;
    },
    checkExpression(event) {
      const allowedChars = /^[0-9+\-*/()\s]+$/;
      if (!allowedChars.test(this.expression)) {
        alert("Expression contains invalid characters, please re-enter!");
        this.expression = this.expression.replace(/[^0-9+\-*/()\s]/g, '');
      } else {
        this.calculateResult();
      }
    },
    isNumberUsed(number) {
      const regex = new RegExp(`\\b${number}\\b`);
      return regex.test(this.expression);
    },
    calculateResult() {
      try {
        // eslint-disable-next-line no-eval
        this.calculatedResult = eval(this.expression); 
      } catch (error) {
        this.calculatedResult = 'Invalid expression';
      }
    },
    submit() {
      if (this.calculatedResult === 1024) {
        const endTime = new Date();
        this.timeTaken = Math.round((endTime - this.startTime) / 1000); 
      } else {
        alert("Incorrect expression. Please try again.");
      }
    }
  }
};
</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.header {
  background-color: #f0f0f0;
  padding: 16px;
  text-align: center;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.numbers-container {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.number-card {
  background-color: '';
  color: grey;
  border: 1px solid grey;
  padding: 32px;
  font-size: 36px;
  text-align: center;
  border-radius: 8px;
}

.input-container {
  width: 100%;
  max-width: 400px;
}

.input-container input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.result-container {
  margin-top: 16px;
  font-size: 20px;
}
</style>
