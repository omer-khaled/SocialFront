export type postType = {
    id:number,
    name:string,
    userId:number,
    content:string,
    postImage:string,
    userImage:string,
    createdAt:string,
    numberOfcomments:number,
    numberOfLikes:number,
    userLiked:boolean,
    LikeType:string|null
}

export type errorType = {
    "msg": "email is not exists",
    "path": "email",
}

export type postsReducerType = {
    posts:null|postType[],
    error:boolean,
    totalPages:null|number,
    loading:boolean
};

export type baseResponseType = {
    error:[]|string|undefined,
    status:boolean
}

export type responsePostsApi = baseResponseType&{
    posts:undefined|postType[],
    totalPages:undefined|number,
};

export type authReducerType = {
    auth:boolean|null,
    user:userType|null,
    errors:errorType[]|null,
    signupErrors:errorType[]|null,
    notifications:number,
    messages:{senderId:number}[]
}

export type responseLoginApi = baseResponseType&{
    accessToken:string|undefined
};

export type responsegetUserInfoApi = baseResponseType&{
    user:userType
};

export type userType = {
    id:string,
    name:string,
    image:string,
    numberOfFriends:number,
    NumberOfPosts:number,
    notifications:number,
    messages:{senderId:number}[]
}

export type requestType = {
    friendId:number,
    userId:number,
    createdAt:string,
    status:boolean,
    id:number,
    name:string,
    image:string
}

export type friendType={
    friendId: number,
    name: string,
    image: string
    status:boolean ,
    createdAt: string,
    messageNumber?:number
}

export type friendReducerType = {
    friends:null|friendType[],
    error:boolean,
    loading:boolean
};

export type responseFriendsApi = baseResponseType&{
    friends:undefined|friendType[],
};

export type responseCreatePostApi = baseResponseType&{
    status:boolean,
    post:postType
};

export type responseCreateCommentApi = baseResponseType&{
    status:boolean,
    comment:commentType
};

export type commentType = {
    id:number,
    userId:number,
    postId:number,
    content:string,
    name:string,
    userImage:string,
    createdAt:string
}
export type likeType = {
    id:number,
    userId:number,
    postId:number,
    type:string,
    name:string,
    userImage:string,
    createdAt:string
}
export type responsegetCommentsApi = baseResponseType&{
    status:boolean,
    comments:commentType[]
};
export type responsegetLikesApi = baseResponseType&{
    status:boolean,
    likes:likeType[],
    likeTypes:string[]
};

export type notificationType = {
    id:number,
    name:string,
    userImage:string,
    postId: number,
    type?: string,
    content?: string,
    createdAt: string,
    commentOwner: number,
    postOwner: number,
    seen: boolean,
    postContent:string,
    postImage:string
}

export type responseNotificationApi = baseResponseType&{
    notifcations:undefined|notificationType[],
};

export type messageType = {
    id: number,
    senderId: number,
    reciverId: number,
    createdAt: string,
    content:string,
    image: string|null,
    seen: boolean
}

export const baseUrl = import.meta.env.VITE_BASU_URL_API;
