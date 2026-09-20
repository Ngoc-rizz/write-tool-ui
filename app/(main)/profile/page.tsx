import { ProfileSettings } from "@/modules/settings/components";
import BackButton from "@/components/common/BackButton/BackButton";

export default function ProfilePage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      <BackButton />
      <ProfileSettings />
    </div>
  );
}
