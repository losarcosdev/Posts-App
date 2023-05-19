import { UserProfile } from ".";

export interface UserPost {
  likes:        number;
  description?: string;
  id:           string;
  slug:         string;
  tag:          string;
  title:        string;
  comments:     number;
  user:         UserProfile;
}
