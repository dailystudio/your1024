const {logger, resputils, requtils}     = require('devbricksx-js');
const constants                         = require("../../modules/constants");
const packageJson                       = require('../../package.json');
const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);


const generationConfig = {
    responseMimeType: "application/json",
    responseSchema: {
        type: "object",
        properties: {
            numbers: {
                type: "array",
                items: {
                    type: "integer"
                }
            },
            expression: {
                type: "string"
            }
        },
        required: [
            "numbers",
            "expression"
        ]
    },
};

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro-002",
    generationConfig: generationConfig
});

module.exports = {

    generateQuestion: async function (req, res) {
        logger.info(`${__function}: generating a question of 1024`);

        const numbers = getRandomFactors();

        const prompt = `我需要你出一个游戏题目，玩法类似24点。我们有且仅有四个数字, ${numbers.join(',')}。`+
            "我们通过对这四个数字进行加、减、乘、除的运算，最终得到1024这个数字。" +
            "在运算中，这四个数字每个数字必须出现一次，且只能出现一次。" +
            "在运算中，加法或者减法运算至少包含一种。" +
            "请给我出一道这样的题目。" +
            "结果用JSON形式返回。结果中包含这四个数字，和对应的如何使用这四个数字计算得出1024的表达式。"
        const result = await model.generateContent(prompt)

        console.log(`prompt: ${JSON.stringify(prompt)}`);
        console.log(`result: ${JSON.stringify(result.response.text())}`);

        return res.send(result.response.text());
    },

}

function getRandomFactors() {
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
}
