interface Question {
  _id?: string
  idQuestion: number
  choices: Array<Choices>
  img: string | undefined
  text: string
  isValidated?: boolean
  _idUser?: number
}

type Choices = {
  correct: boolean
  selected?: boolean
  isSelectedCorrect?: boolean
  isNotSelectedCorrect?: boolean
  key: number
  text: string
}

interface CorrectedQuiz {
  correct: Array<{idQuestion: number}>
  wrong: Array<{idQuestion: number}>
}

interface QuestionResult {
  _id?: string
  idQuestion: number
  isValidated?: boolean
}

const QuizCorrection = (answers: Question[][]) => {
  let final: CorrectedQuiz = {correct: [], wrong: []}
  
  for (let i = 0; i < answers.length; i++) {
    console.log(answers[i])
    if (answers[i][0] && answers[i][0].isValidated == true) {
      final.correct.push({idQuestion: answers[i][0].idQuestion})
    } else if (answers[i][0] && !answers[i][0].isValidated) {
      final.wrong.push({idQuestion: answers[i][0].idQuestion})
    }
  }
  return final
}

export default QuizCorrection