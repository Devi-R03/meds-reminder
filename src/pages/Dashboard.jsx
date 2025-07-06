import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [user, setUser] = useState("");
  const [medications, setMedications] = useState([]);
  const [careTaker, setCareTaker] = useState(false);

  const navigate = useNavigate();

  const isTakenToday = (takenDate) => {
    if (!takenDate) return false;

    const taken = new Date(takenDate);
    const today = new Date();

    return (
      taken.getFullYear() === today.getFullYear() &&
      taken.getMonth() === today.getMonth() &&
      taken.getDate() === today.getDate()
    );
  };

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data.user) {
        setUser(data.user);
      } else {
        alert(error.message);
        navigate("/");
      }

      const { data: meds, error: medsError } = await supabase
        .from("medications")
        .select("*")
        .eq("user_id", data.user.id);

      if (!medsError) {
        setMedications(meds);
      } else {
        alert("failed to fetch user medications list" + medsError.message);
      }
    };

    fetchUser();
  }, []);

  const handleAddMedications = async (e) => {
    e.preventDefault();
    if (!name || !dosage) return;

    const { error } = await supabase.from("medications").insert([
      {
        name,
        dosage,
        user_id: user?.id,
        taken_date: null,
      },
    ]);

    if (error) {
      alert(`failed to add medications ${error.message}`);
    } else {
      alert("successfully added");
      setMedications((prev) => [...prev, ...data]);
      setName("");
      setDosage("");
    }
  };

  const markAsTaken = async (id) => {
    const today = new Date().toISOString().split("T")[0];

    const { error } = await supabase
      .from("medications")
      .update({ taken_date: today })
      .eq("id", id);

    if (!error) {
      setMedications((prev) =>
        prev.map((med) => (med.id === id ? { ...med, taken_date: today } : med))
      );
    } else {
      alert("Failed to mark as taken");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-100 via-pink-200 to-red-300">
      <div className="p-6 max-w-2xl mx-auto">
        <h2 className="text-center font-bold">Welcome, {user.email}</h2>

        <div className="flex items-center justify-center mt-5">
          {" "}
          <button
            onClick={() => setCareTaker(!careTaker)}
            className="bg-blue-500 text-white rounded px-6 py-2 mb-5 cursor-pointer"
          >
            {careTaker ? "Patient view " : "Caretaker view"}
          </button>
        </div>

        {!careTaker && (
          <div className="flex items-center justify-center my-10 ">
            <form className=" bg-red-100 flex items-center justify-start  flex-col  rounded space-y-5  px-50 py-10">
              <h3 className="font-bold text-2xl">Medications Form</h3>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border rounded px-20 py-3 "
                placeholder="Enter your medications"
                required
              ></input>
              <br />
              <input
                type="text"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                className="border rounded px-20 py-3"
                placeholder="Enter your dosage"
                required
              ></input>
              <br />
              <button
                onClick={handleAddMedications}
                className="rounded bg-green-500 px-5 py-2 text-white font-bold cursor-pointer"
              >
                Add medications
              </button>
            </form>
          </div>
        )}

        {!careTaker && (
          <div>
            <h2 className="mb-5 text-center text-2xl font-bold">
              Your Medications
            </h2>

            {medications.length === 0 ? (
              <p className="mb-5 text-2xl text-center font-bold text-red">
                no medications added yet
              </p>
            ) : (
              <table className="table-auto w-full border border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border px-4 py-2">#</th>
                    <th className="border px-4 py-2">Name</th>
                    <th className="border px-4 py-2">Dosage</th>
                    <th className="border px-4 py-2">Taken</th>
                    <th className="border px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {medications.map((med, index) => {
                    const today = new Date().toISOString().split("T")[0];
                    const isTaken = isTakenToday(med.taken_date);
                    return (
                      <tr key={med.id}>
                        <td className="border px-4 py-2">{index + 1}</td>
                        <td className="border px-4 py-2">{med.name}</td>
                        <td className="border px-4 py-2">{med.dosage}</td>
                        <td className="border px-4 py-2">
                          {isTaken ? "✅ Yes" : "❌ No"}
                        </td>
                        <td className="border px-4 py-2">
                          {!isTaken ? (
                            <button
                              className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                              onClick={() => markAsTaken(med.id)}
                            >
                              Mark as Taken
                            </button>
                          ) : (
                            <p>completed</p>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

        {careTaker && (
          <div className="bg-gray-50 border rounded p-4 mt-4">
            <h2 className="text-xl font-bold mb-3">Caretaker Dashboard</h2>
            {medications.length === 0 ? (
              <p className="font-bold text-2xl text-center">No Medications</p>
            ) : (
              <ul className="space-y-4">
                {medications.map((med) => {
                  const today = new Date().toISOString().split("T")[0];
                  const istaken = isTakenToday(med.taken_date);
                  return (
                    <li
                      key={med.id}
                      className={`p-4 border rounded flex items-center justify-between ${
                        istaken ? "bg-green-100" : "bg-red-100"
                      }`}
                    >
                      <div>
                        <p>{med.name}</p>
                        <p>dosage : {med.dosage}</p>
                        <p>{istaken ? "Taken Today" : "Not Taken Today"}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
