import { api } from "~/utils/api";

const CtfAnswers = () => {
  const answers = api.ctfs.getAll.useQuery();

  return (
    <div className="flex flex-col gap-4">
      {answers.data &&
        answers.data.map((item, index) => (
          <div
            key={`ctf-${index}`}
            className="flex min-w-[250px] flex-col rounded-md p-4 pb-2 pt-3.5 shadow-md shadow-gray-300"
          >
            <div className="flex flex-col">
              <span className="text-sm text-gray-600">Name</span>
              <span className="translate-y-[-5px]">{item.name}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-600">Answer</span>
              <span className="translate-y-[-5px]">{item.flag}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-600">Points</span>
              <span className="translate-y-[-5px]">{item.points}</span>
            </div>
          </div>
        ))}
    </div>
  );
};

export default CtfAnswers;
