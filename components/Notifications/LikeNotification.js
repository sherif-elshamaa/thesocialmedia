import React from "react";
import { Feed } from "semantic-ui-react";
import calculateTime from "../../utils/calculateTime";
import Link from "next/link";

function LikeNotification({ notification }) {
  return (
    <>
      <Feed.Event>
        <Feed.Label image={notification.user.profilePicUrl} />
        <Feed.Content>
          <Feed.Summary>
            <>
              <Feed.User as="a" href={`/${notification.user.username}`}>
                {notification.user.name}
              </Feed.User>{" "}
              Liked Your <Link href={`/post/${notification.post._id}`}>post</Link>
              <Feed.Date>{calculateTime(notification.date)}</Feed.Date>
            </>
          </Feed.Summary>
          {notification.post.picUrl && (
            <Feed.Extra images>
              <Link href={`/post/${notification.post._id}`}>
                <img src={notification.post.picUrl} />
              </Link>
            </Feed.Extra>
          )}
        </Feed.Content>
      </Feed.Event>
      <br />
    </>
  );
}

export default LikeNotification;
