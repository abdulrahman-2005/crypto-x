import { UpdateCredentialsForm } from "../components/update-credentials-form"

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-8 text-center text-white">Admin Settings</h1>
      <div className="bg-[#1a1b23] rounded-lg shadow border border-gray-800">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-6 text-white">Update Credentials</h2>
          <UpdateCredentialsForm />
        </div>
      </div>
    </div>
  )
} 