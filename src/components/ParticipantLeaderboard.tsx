import { api } from "~/utils/api";

const ParticipantLeaderboard = () => {
  const participants = api.participants.getParticipants.useQuery();

  return (
    <div className="flex h-fit min-w-[350px] flex-col gap-6 rounded-md p-6 shadow-md shadow-gray-300">
      <h1 className="text-xl">Admin Emails</h1>
      <div className="flex flex-col gap-2">
        {participants.data ? (
          participants.data.map((participant, index) => (
            <div key={`participant-${index}`} className="flex gap-4">
              <div className="h-[24px] w-[24px] rounded-md bg-gray-100 text-center">
                {index + 1}
              </div>
              <span>
                {participant.name}: {participant.points}
              </span>
            </div>
          ))
        ) : (
          <h2 className="text-lg">No participants</h2>
        )}
      </div>
    </div>
  );
};

export default ParticipantLeaderboard;
