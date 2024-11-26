"use client";

import { useEffect, useState } from "react";
import ReactPlayer from "react-player";

const VideoPlayer = ({ url }: { url: string }) => {
  const [mount, setMount] = useState(false);

  useEffect(() => {
    setMount(true);
  }, []);

  if (!mount) return null;
  return (
    <>
      <ReactPlayer
        controls
        width="100%"
        height="100%"
        style={{ objectFit: "cover" }}
        url={url}
      />
    </>
  );
};

export default VideoPlayer;
