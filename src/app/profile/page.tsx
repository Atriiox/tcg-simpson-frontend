import Profile from "../../features/user/components/Profile";

export default function ProfilePage() {
  const mockUserId = "simpson-fan-123";

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-6">
      <div className="mb-6 text-center">
        <h1 className="text-title text-simpson-yellow mb-1">Mon Compte</h1>
        <p className="text-body text-gray-500">
          Gestion du compte
        </p>
      </div>
      <Profile userId={mockUserId} />
    </main>
  );
}
