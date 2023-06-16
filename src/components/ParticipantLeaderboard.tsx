import { api } from "~/utils/api";

const ParticipantLeaderboard = () => {
  const participants = api.participants.getParticipants.useQuery();
  const admins = api.user.getAdmins.useQuery();

  const getFilteredParticipants = () => {
    if (!participants.data || !admins.data) return [];

    const adminEmails = admins.data.map((item) => item.email);

    return participants.data.filter(
      (item) => !adminEmails.includes(item.email)
    );
  };

  const filteredData = getFilteredParticipants();

  return (
    <div className="flex h-fit min-w-[350px] flex-col gap-6 rounded-md p-6 shadow-md shadow-gray-300">
      <h1 className="text-xl">Admin Emails</h1>
      <div className="flex flex-col gap-2">
        {filteredData.length > 0 ? (
          filteredData.map((participant, index) => (
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
