import { useEffect, useState } from "react";
import { api } from "~/utils/api";

const AdminsEdit = () => {
  const dbAdmins = api.user.getAdmins.useQuery();
  const [admins, setAdmins] = useState<string[]>([]);
  const [adding, setAdding] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const addEmailMutation = api.user.addAdmin.useMutation();
  const removeAdminMutation = api.user.removeAdmin.useMutation();

  useEffect(() => {
    if (dbAdmins.data) {
      setAdmins(dbAdmins.data.map((item) => item.email));
    }
  }, [dbAdmins.data]);

  const toggleAdding = () => {
    setAdding((prev) => !prev);
  };

  const handleAddAdmin = () => {
    const email = newEmail.trim();
    if (email.length > 0) {
      addEmailMutation.mutate(email);
      setAdmins((prev) => [...prev, email]);
      setAdding(false);
    }
  };

  const handleUpdateEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setNewEmail(value);
  };

  const handleRemoveAdmin = (admin: string) => {
    removeAdminMutation.mutate(admin);
    setAdmins((prev) => prev.filter((item) => item !== admin));
  };

  return (
    <div className="flex h-fit min-w-[350px] flex-col gap-6 rounded-md p-6 shadow-md shadow-gray-300">
      <h1 className="text-xl">Admin Emails</h1>
      <div className="flex flex-col gap-2">
        {admins.map((admin, index) => (
          <div key={`admin-${index}`} className="flex justify-between gap-2">
            <span>{admin}</span>
            <button
              onClick={() => handleRemoveAdmin(admin)}
              className="text-red-600"
            >
              Remove
            </button>
          </div>
        ))}
        {adding && (
          <div className="flex gap-2">
            <input
              className="flex-1 rounded-md border-[1.5px] border-gray-200 p-1 outline-none duration-150 focus:border-gray-400"
              placeholder="Enter Email"
              value={newEmail}
              onChange={handleUpdateEmail}
            />
            <button
              className="w-fit rounded-md bg-gray-100 px-3 py-1 shadow-black duration-150 hover:shadow-md active:translate-y-[2px]"
              onClick={handleAddAdmin}
            >
              Add
            </button>
          </div>
        )}
      </div>
      <button
        className="w-fit rounded-md bg-gray-100 px-3 py-1 shadow-black duration-150 hover:shadow-md active:translate-y-[2px]"
        onClick={toggleAdding}
      >
        {adding ? "Cancel Adding" : "Add"}
      </button>
    </div>
  );
};

export default AdminsEdit;
