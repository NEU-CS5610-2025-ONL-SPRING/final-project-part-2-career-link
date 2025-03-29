import { useAuthUser } from "../../auth/authContext";

export default function Profile() {
  const { user } = useAuthUser();
  return (
    <div>
      <div>
        <p>Name: {user?.username}</p>
      </div>
      <div>
        <p>📧 Email: {user?.email}</p>
      </div>
      <div>
        Role : {user?.role}
      </div>
    </div>
  );
}
