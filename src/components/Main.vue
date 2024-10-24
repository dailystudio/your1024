<template>
    <v-app class="oms-app">
      <v-main class="main">
        <h1>{{ $t('message.mainPageTitle') }}</h1>
        <v-row class="numbers-container">
          <v-col
            v-for="number in numbers"
            :key="number"
            class="number-card"
            cols="3"
          >
            <div
                class="number-card__number"
                :class="isNumberUsed(number) ? 'active' : ''"
            >
              {{ number }}
            </div>
          </v-col>
        </v-row>
        <v-text-field
            class="expression-input"
            v-model="expression"
            single-line
            persistent-hint
            :hint="inputHint"
            @input="filterExpression"
        ></v-text-field>
        <v-btn
            :disabled="calculatedResult !== 1024 || !isAllNumberUsed()"
            variant="outlined" class="submit"
            @click="submit">{{ $t('message.commonLabelSubmit')}}</v-btn>
        <div class="time-taken" v-if="timeTaken">
          Time taken: {{ timeTaken }} seconds
        </div>
      </v-main>
      <v-footer fixed app>
        <v-container>
          <v-col id="copyright"
                 class="text-center"
                 cols="12"
          >
            {{ $t("message.commonFooterCopyright") }} {{ new Date().getFullYear() }} &#169;
          </v-col>
        </v-container>
      </v-footer>
    </v-app>
</template>

<script>
import { useI18n } from 'vue-i18n';

export default {
  data() {
    return {
      fullPath: this.$route.fullPath,
      query: this.$route.query,
      theme: 'light',
      locale: navigator.language,

      numbers: this.getRandomFactors(),
      expression: '',
      calculatedResult: 0,
      startTime: new Date(),
      timeTaken: null
    };
  },

  setup() {

  },

  computed: {
    inputHint() {
      const {t} = useI18n();

      let hint = '';
      if (this.calculatedResult && this.calculatedResult !== 0) {
        hint = `${t('message.mainInputHint')}${this.calculatedResult}`
      }

      return hint;
    }
  },

  mounted: function () {
    console.log(`locale: ${JSON.stringify(this.$route.query.locale)}`);
    console.log(`theme: ${JSON.stringify(this.$route.query.theme)}`);
    if (this.query.theme) {
      this.theme = this.query.theme
    } else {
      this.theme = 'dark'
    }

    if (this.query.locale) {
      this.locale=this.query.locale
    }

    if (this.query.style) {
      this.style=this.query.style
    }

    window.onresize = () => {
      return (()=> {
        this.displayHeight = document.documentElement.clientHeight;
      })();
    }

    this.$el.querySelectorAll('input').forEach(function (element) {
      element.setAttribute('autocomplete', 'off');
    });

  },

  watch: {
    expression() {
      this.calculateResultOfExp()
    },
    theme(theme) {
      console.log(`theme changed: ${theme}`);
      document.documentElement.setAttribute(
          'theme', theme);
    },
    locale(loc) {
      console.log(`locale changed: ${loc}`);
      this.$i18n.locale = loc
    },
    displayHeight: function () {
      if (this.docHeight > this.displayHeight) {
        this.showFooter = false;
      } else {
        this.showFooter = true;
      }
    }

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
    filterExpression(event) {
      const allowedChars = /^[0-9+\-*/()^\s]+$/;
      if (!allowedChars.test(this.expression)) {
        this.expression = this.expression.replace(/[^0-9+\-*/()\s]/g, '');
      }
    },
    isNumberUsed(number) {
      const regex = new RegExp(`\\b${number}\\b`);
      return regex.test(this.expression);
    },
    isAllNumberUsed() {
      for (let i = 0; i < this.numbers.length; i++) {
        let used = this.isNumberUsed( this.numbers[i])
        if (!used) {
          return false;
        }
      }

      return true;
    },
    calculateResultOfExp() {
      try {
        this.calculatedResult = eval(this.expression.replace(/\^/g, "**"));
      } catch (error) {
        this.calculatedResult = 0;
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
#app {
  margin: 0;
}

:deep(.v-messages__message) {
  color: var(--primary-color) !important;
  font-size: 16px;
  text-align: left;
  margin: 8px 0
}

h1 {
  margin: 30px;
}
.main {
  padding: 16px;
}

.v-row {
  margin: 0;
}

.v-col {
  padding: 0;
}

.number-card__number {
  color: grey;
  border: 1px solid grey;
  font-size: 36px;
  text-align: center;
  border-radius: 8px;
  margin: 4px;
}

.number-card .active {
  color: white;
  background-color: var(--primary-color);
}

.expression-input {
  margin: 16px;
}

.expression-input :deep(input) {
  font-size: 22px;
}

.time-taken {
  margin: 16px;
}

.result-container {
  margin-top: 16px;
  font-size: 20px;
}
</style>
