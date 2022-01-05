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

const QuizCorrection2 = (answers: Question[]) => {
  let final: CorrectedQuiz = {correct: [], wrong: []}
  let grouped_answers: Question[][] = []
  
  for (let s = 0; s < 5; s++) {
    grouped_answers.push(answers.filter((q) => q.idQuestion == s))
  }

  for (let i = 0; i < grouped_answers.length; i++) {
    if (grouped_answers[i] && grouped_answers[i][0].isValidated == true) {
      final.correct.push({idQuestion: grouped_answers[i][0].idQuestion})
    } else {
      final.wrong.push({idQuestion: grouped_answers[i][0].idQuestion})
    }
  }
  return final
}

export default QuizCorrection2