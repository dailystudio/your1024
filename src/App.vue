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
    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      numbers: [2, 4, 8, 64],
      expression: '',
      isCheckingNumbers: false
    };
  },
  methods: {
    checkExpression(event) {
      const allowedChars = /^[0-9+\-*/()\s]+$/;
      if (!allowedChars.test(this.expression)) {
        alert("表达式包含非法字符，请重新输入！");
        this.expression = this.expression.replace(/[^0-9+\-*/()\s]/g, '');
        this.isCheckingNumbers = false;
      } else {
        // 如果输入的是数字，设置标志为 true
        if (/[0-9]/.test(this.expression.slice(-1))) {
          this.isCheckingNumbers = true;
        }

        // 如果输入空格、运算符或括号，或者标志为 true，并且最后一个输入不是 backspace，则进行数字有效性检查
        if ((/[+\-*/()\s]/.test(this.expression.slice(-1)) || this.isCheckingNumbers) && event.inputType !== 'deleteContentBackward') {
          this.checkInvalidNumbers();
          this.isCheckingNumbers = false;
        }
      }
    },
    checkInvalidNumbers() {
      const usedNumbers = this.expression.match(/\d+/g) || [];
      // 检查所有数字是否有效
      for (const numberStr of usedNumbers) {
        const number = parseInt(numberStr);
        if (!this.numbers.includes(number)) {
          alert(`无效数字: ${number}`);
          return; // 发现无效数字，立即停止检查
        }
      }
    },
    isNumberUsed(number) {
      const regex = new RegExp(`\\b${number}\\b`);
      return regex.test(this.expression);
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
</style>
