import BoringAvatar from "boring-avatars";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar-primitive";

const boringAvatarColors = [
  "#E93D82",
  "#D6409F",
  "#3E63DD",
  "#0090FF",
  "#E54D2E",
  "#FFC53D",
];

export function ProfileAvatar({
  profile,
  size = 32,
}: {
  profile: {
    avatarUrl: string | null;
    handle: string;
  };
  size?: number;
}) {
  return (
    <Avatar style={{ width: size, height: size }}>
      {profile.avatarUrl ? (
        <AvatarImage src={profile.avatarUrl} alt={profile.handle} />
      ) : (
        // Use an invalid/empty image source that will fail to load immediately,
        // forcing the AvatarFallback to render
        <AvatarImage src="" alt={profile.handle} />
      )}
      <AvatarFallback>
        <BoringAvatar
          size={size}
          name={profile.handle}
          variant="marble"
          colors={boringAvatarColors}
        />
      </AvatarFallback>
    </Avatar>
  );
}
