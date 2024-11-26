export interface ChatPersonType {
  name: string;
  image: string | null;
}

export interface MessageType {
  userId: string;
  content: string;
  createdAt: string;
  id: number;
  media: {
    id: number;
    type: "IMAGE" | "VIDEO";
    url: string;
    messageId: number;
  } | null;
}

export type PreviewType = {
  type: "IMAGE" | "VIDEO";
  url: string;
};
export type MediaType = {
  type: "IMAGE" | "VIDEO";
  file: File;
};

export type CompleteProfileType = {
  username: string;
  country: string;
  city: string;
  bio: string;
  profileImg?: File | null;
  backdropImg?: File | null;
};

export interface PersonItemType {
  conversationId: string;
  lastMessage: string | null;
  otherUser: [
    {
      id: string;
      fullname: string;
      image: string;
    }
  ];
}

export interface CommentType {
  id: number;
  content: string | null;
  createdAt: Date;
  userId: string;
  user: {
    username: string | null;
    name: string;
    image: string | null;
    biography: string | null;
    createdAt: Date;
    _count: {
      followers: number;
      following: number;
    };
  };
  media: {
    type: "IMAGE" | "VIDEO";
    url: string;
  } | null;
}

export interface PostType {
  content: string | null;
  createdAt: Date;
  id: string;
  isLiked: boolean;
  isReposted: boolean;
  isSaved: boolean;
  isMyPost: boolean;
  category:string[];
  user: {
    username: string | null;
    name: string;
    image: string | null;
    biography: string | null;
    createdAt: Date;
    _count: {
      followers: number;
      following: number;
    };
  };
  userId: string;
  _count: {
    likes: number;
    reposts: number;
    comments: number;
    views: number;
  };
  media: {
    type: "IMAGE" | "VIDEO";
    url: string;
  } | null;
  repostedBy?: {
    name: string;
    image: string | null;
  };
}

export type PostDetailType = PostType & { comments: CommentType[] };

export interface NotificationType {
  user: {
    name: string;
    image: string | null;
  };
  sender: {
    name: string;
    image: string | null;
  };
  createdAt: string;
  read: boolean;
  type: "LIKE" | "COMMENT" | "FRIEND_REQUEST" | "REPOST";
  id: string;
  postId: string;
}

export interface ProfileType {
  id: string;
  image: string | null;
  name: string;
  username: string;
  biography: string;
  city: string;
  country: string;
  createdAt: string;
  backdrop_image: string | null;
  _count: {
    followers: number;
    following: number;
  };
}
export interface UserItemType {
  id: string;
  name: string;
  image: string;
  username: string;
}
export interface FriendReqItemType {
  senderId: string;
  sender: {
    username: string | null;
    image: string | null;
    name: string;
  };
}

export interface queryType {
  query:string,
  type:"category" | "tag" | "search"
} 