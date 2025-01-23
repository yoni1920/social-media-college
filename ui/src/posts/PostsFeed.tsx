import { List } from "@mui/material";
import { usePosts } from "./hooks/usePosts";
import { Post } from "./Post";

type Props = {
  profileId?: string;
};
export const PostsFeed = ({ profileId }: Props) => {
  const posts = usePosts(profileId);

  return (
    <List>
      {posts.map((post) => (
        <Post post={post} />
      ))}
    </List>
  );
};
