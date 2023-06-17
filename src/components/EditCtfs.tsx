import { type CtfChallenge } from "@prisma/client";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";

const EditCtfs = () => {
  const dbCtfs = api.ctfs.getAll.useQuery();
  const deleteCtfMutation = api.ctfs.deleteCtf.useMutation();
  const updateCtfMutation = api.ctfs.updateCtf.useMutation();
  const [adding, setAdding] = useState(false);
  const [ctfs, setCtfs] = useState<CtfChallenge[]>([]);
  const [editingId, setEditingId] = useState<string>("");
  const defaultCtfValue: CtfChallenge = {
    id: "",
    link: "",
    name: "",
    flag: "",
    points: 0,
  };
  const [newCtf, setNewCtf] = useState<CtfChallenge>({ ...defaultCtfValue });

  useEffect(() => {
    if (dbCtfs.data) {
      setCtfs(dbCtfs.data);
    }
  }, [dbCtfs.data]);

  const toggleAdding = () => {
    setAdding((prev) => !prev);
  };

  const handleRemoveCtf = (id: string) => {
    deleteCtfMutation.mutate(id);
    setCtfs((prev) => prev.filter((item) => item.id !== id));
  };

  const updateNewCtfValue = (
    key: keyof CtfChallenge,
    value: string | number
  ) => {
    setNewCtf((prev) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      prev[key] = value;

      return { ...prev };
    });
  };

  const handleAddCtf = () => {
    console.log("adding", newCtf);
  };

  const setEditing = (id: string) => {
    setEditingId(id);
  };

  const cancelEditing = () => {
    setEditing("");
  };

  const updateCtfValue = (
    id: string,
    key: keyof CtfChallenge,
    value: string | number
  ) => {
    setCtfs((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          item[key] = value;
        }
        return item;
      })
    );
  };

  const updateCtf = (id: string) => {
    const challenge = ctfs.find((val) => val.id === id);
    if (challenge) {
      updateCtfMutation.mutate(challenge);
      cancelEditing();
    }
  };

  return (
    <div className="flex h-fit min-w-[350px] flex-col gap-6 rounded-md p-6 shadow-md shadow-gray-300">
      <h1 className="text-xl">Edit Ctfs</h1>
      <div className="flex flex-col gap-2">
        {ctfs.length > 0 ? (
          ctfs.map((ctf, index) =>
            editingId === ctf.id ? (
              <div
                key={`admin-${index}`}
                className="flex flex-col gap-2 rounded-md border-[1px] border-gray-300 p-2"
              >
                <input
                  className="w-full rounded-md border-[1.5px] border-gray-200 p-1 outline-none duration-150 focus:border-gray-400"
                  placeholder="Ctf Name"
                  value={ctf.name}
                  onChange={(e) =>
                    updateCtfValue(ctf.id, "name", e.currentTarget.value)
                  }
                />
                <input
                  className="w-full rounded-md border-[1.5px] border-gray-200 p-1 outline-none duration-150 focus:border-gray-400"
                  placeholder="Ctf Link"
                  value={ctf.link}
                  onChange={(e) =>
                    updateCtfValue(ctf.id, "link", e.currentTarget.value)
                  }
                />
                <input
                  className="w-full rounded-md border-[1.5px] border-gray-200 p-1 outline-none duration-150 focus:border-gray-400"
                  placeholder="Ctf Flag"
                  value={ctf.flag}
                  onChange={(e) =>
                    updateCtfValue(ctf.id, "flag", e.currentTarget.value)
                  }
                />
                <input
                  className="w-full rounded-md border-[1.5px] border-gray-200 p-1 outline-none duration-150 focus:border-gray-400"
                  placeholder="Ctf Points"
                  type="number"
                  value={ctf.points}
                  onChange={(e) =>
                    updateCtfValue(ctf.id, "points", +e.currentTarget.value)
                  }
                />
                <div className="flex gap-2">
                  <button
                    className="w-fit rounded-md bg-gray-100 px-3 py-1 shadow-black duration-150 hover:shadow-md active:translate-y-[2px]"
                    onClick={() => updateCtf(ctf.id)}
                  >
                    update
                  </button>
                  <button
                    className="w-fit rounded-md bg-gray-100 px-3 py-1 shadow-black duration-150 hover:shadow-md active:translate-y-[2px]"
                    onClick={cancelEditing}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div
                key={`admin-${index}`}
                className="flex items-start justify-between gap-2 rounded-md border-[1px] border-gray-300 p-2"
              >
                <div className="flex flex-col gap-1">
                  <span>
                    ({ctf.points}) {ctf.name}
                  </span>
                  <span>{ctf.link}</span>
                  <span>{ctf.flag}</span>
                </div>
                <div className="flex flex-col items-end">
                  <button
                    onClick={() => handleRemoveCtf(ctf.id)}
                    className="text-red-600"
                  >
                    Remove
                  </button>
                  <button
                    className="text-gray-500"
                    onClick={() => setEditing(ctf.id)}
                  >
                    Edit
                  </button>
                </div>
              </div>
            )
          )
        ) : (
          <h2 className="text-lg">No Ctfs</h2>
        )}
        {adding && (
          <div className="border-300 flex flex-col gap-2 rounded-md border-[1px] p-2">
            <input
              className="w-full rounded-md border-[1.5px] border-gray-200 p-1 outline-none duration-150 focus:border-gray-400"
              placeholder="Ctf Name"
              value={newCtf.name}
              onChange={(e) => updateNewCtfValue("name", e.currentTarget.value)}
            />
            <input
              className="w-full rounded-md border-[1.5px] border-gray-200 p-1 outline-none duration-150 focus:border-gray-400"
              placeholder="Ctf Name"
              value={newCtf.link}
              onChange={(e) => updateNewCtfValue("link", e.currentTarget.value)}
            />
            <input
              className="w-full rounded-md border-[1.5px] border-gray-200 p-1 outline-none duration-150 focus:border-gray-400"
              placeholder="Ctf Name"
              value={newCtf.flag}
              onChange={(e) => updateNewCtfValue("flag", e.currentTarget.value)}
            />
            <input
              className="w-full rounded-md border-[1.5px] border-gray-200 p-1 outline-none duration-150 focus:border-gray-400"
              placeholder="Ctf Name"
              type="number"
              value={newCtf.points}
              onChange={(e) =>
                updateNewCtfValue("points", +e.currentTarget.value)
              }
            />
            <button
              className="w-fit rounded-md bg-gray-100 px-3 py-1 shadow-black duration-150 hover:shadow-md active:translate-y-[2px]"
              onClick={handleAddCtf}
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

export default EditCtfs;
