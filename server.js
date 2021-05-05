const Kahoot = require('kahoot.js-updated');

const botname = process.argv[3];
const id = JSON.parse(process.argv[2]);
const num = JSON.parse(process.argv[4]);

const ran = (a, b) => Math.random(1) * (b - a) + a;

console.log("Connecting to kahoot: " + id);
console.log("Bot usernames: " + botname);
console.log("Number of bots: " + num);
let keepplaying = true;
if (typeof id != "number" || typeof num != "number") {
  console.log("Must define Number of bots as third argument...");
  return;
}
if (!(id >= 100000 || id <= 9999999)) {
  console.log("not valid id");
  return;
}
let sessions = [];

async function main() {
    for (let i = 0; i < num+1; i++) {

        await new Promise((y, n) => {
            sessions.unshift(new Kahoot());
            let session = sessions[0];

            session.on("quizStart", quiz => {
                console.log(
                    botname +
                    i +
                    " Ready "
                );
            });
            session.on("finish", e => {
              console.log(
                "im bot " +
                  i +
                  " and i ranked " +
                  e.rank +
                  " - " +
                  e.correct +
                  "correct and " +
                  e.incorrect +
                  " wrong"
              );
              session.leave();
              keepplaying = false;
            });
            session.on("joined", () => {
              console.log(botname + i + " joined");
              y(true);
            });
            session.on("questionStart", (question)=>{
                sessions[0].leave();
                setTimeout(()=>{
                    session.answerQuestion(Math.floor((ran(0.5,1)) *
                    (question.quiz.answerCounts[question.index] || 0)));
                }, ran(1500,7000));
            });
            session.join(id, botname + i, "0");
        }).catch(err => {
          console.log(err);
          return;
        });

    }
    await new Promise(r => {
        setTimeout(() => {
            if (!keepplaying) {
                r(true);
            }
        }, 10);
    });
    console.log("Completed");
}
main();
