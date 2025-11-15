import BoringAvatar from "boring-avatars";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar-primitive";

export function ProfileAvatar({
  profile,
}: {
  profile: {
    avatarUrl: string | null;
    handle: string;
  };
}) {
  return (
    <Avatar>
      {profile.avatarUrl && (
        <AvatarImage src={profile.avatarUrl} alt={profile.handle} />
      )}
      <AvatarFallback>
        <BoringAvatar
          size={32}
          name={profile.handle}
          variant="marble"
          colors={["#000000", "#111111", "#222222", "#333333", "#444444"]}
        />
      </AvatarFallback>
    </Avatar>
  );
}
