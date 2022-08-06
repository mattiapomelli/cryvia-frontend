import { useQuiz } from './QuizProvider'

const FinalRoom = () => {
  const [{ quiz, playersCount }] = useQuiz()

  return (
    <>
      <div className="bg-tertiary flex flex-col gap-2 p-4 rounded-default items-center mt-20 max-w-md mx-auto">
        <p className="text-text-secondary">You have completed</p>
        <h1 className="text-3xl font-bold text-center">{quiz.title}</h1>
        <p className="text-3xl">🎉</p>
        <p className="mt-4">
          <span className="font-bold">{playersCount} </span>
          people have completed the quiz.
        </p>
        <div className="text-center flex flex-col gap-2 mt-2 mb-2">
          <p className="mb-4">
            Waiting for other users to finish and then setting winners on smart
            contract...
          </p>
          <p className="text-sm  bg-[#fff2ab] p-3 rounded-default">
            This may take a while, sometimes Mumbai Testnet transactions take
            several minutes to be confirmed... You can leave this page and come
            back in a while to discover if you won!
          </p>
        </div>
      </div>
    </>
  )
}

export default FinalRoom
