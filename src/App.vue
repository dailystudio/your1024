<template>
  <div class="app">
    <header class="header">
      <h1>1024 游戏</h1>
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
        <input type="text" v-model="expression" placeholder="请输入表达式" @input="checkExpression">
      </div>
      <div class="result-container" v-if="expression">
        结果: {{ calculatedResult }}
      </div>
    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      numbers: [2, 4, 8, 64],
      expression: '',
      calculatedResult: ''
    };
  },
  methods: {
    checkExpression(event) {
      const allowedChars = /^[0-9+\-*/()\s]+$/;
      if (!allowedChars.test(this.expression)) {
        alert("表达式包含非法字符，请重新输入！");
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
        this.calculatedResult = '错误的表达式';
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
