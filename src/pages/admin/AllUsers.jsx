import { useEffect, useState } from "react";
import { getAllUsers } from "../../api/userApi";

export default function AllUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllUsers().then((data) => {
      setUsers(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <p className="text-cinema-muted px-6 py-8">Loading…</p>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h2 className="font-display text-4xl text-cinema-gold mb-8 tracking-wide">ALL USERS</h2>

      <div className="bg-cinema-surface border border-cinema-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-cinema-bg text-cinema-muted text-left">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-cinema-border">
                <td className="px-4 py-3">{u.name}</td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3">{u.phone}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs ${u.role === "ADMIN" ? "bg-cinema-gold text-cinema-bg" : "bg-cinema-border text-cinema-muted"}`}>
                    {u.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}