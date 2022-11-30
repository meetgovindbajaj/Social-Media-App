import { createSlice } from "@reduxjs/toolkit";
const page = {
  1: "Home",
  2: "Messanger",
  3: "Profile",
  4: "Login",
  5: "Settings",
  6: "Notifications",
  7: "Not Found!",
  8: "Internal Server Error!",
};
const pointerEvents = {
  1: "all",
  2: "none",
};
const initialState = {
  lightMode: true,
  newPost: false,
  currPage: page[1],
  currPageIndex: 1,
  width: window.innerWidth || document.documentElement.clientWidth,
  initLoading: false,
  user: false,
  singlePost: [],
  post: [],
  comments: [],
  replies: [],
  homePE: pointerEvents[1],
  replyOpen: "",
  commentOpen: "",
};

export const Reducer = createSlice({
  name: "Reducer",
  initialState,
  reducers: {
    setlightModeTrue: (state) => {
      state.lightMode = true;
    },
    setlightModeFalse: (state) => {
      state.lightMode = false;
    },
    setHomePEAll: (state) => {
      state.homePE = pointerEvents[1];
    },
    setHomePENone: (state) => {
      state.homePE = pointerEvents[2];
    },
    setnewPostTrue: (state) => {
      state.newPost = true;
    },
    setnewPostFalse: (state) => {
      state.newPost = false;
    },
    setInitLoadingTrue: (state) => {
      state.initLoading = true;
    },
    setInitLoadingFalse: (state) => {
      state.initLoading = false;
    },
    setWidth: (state) => {
      state.width = document.documentElement.clientWidth || window.innerWidth;
    },
    setCurrPage: (state, action) => {
      if (typeof action.payload === "number") {
        state.currPage = page[action.payload];
        state.currPageIndex = action.payload;
      }
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setPost: (state, action) => {
      state.post = action.payload;
    },
    setSinglePost: (state, action) => {
      state.singlePost = action.payload;
    },
    setComment: (state, action) => {
      state.comments = action.payload;
    },
    setReply: (state, action) => {
      state.replies = action.payload;
    },
    updatePost: (state, action) => {
      let arr = [...action.payload, ...state.post];
      state.post = arr;
    },
    deletePost: (state, action) => {
      let arr = state.post.filter((item) => {
        return item._id !== action.payload;
      });
      state.post = arr;
    },
    updatePostLike: (state, action) => {
      let arr = state.post.map((item) => {
        if (item._id === action.payload._id) {
          return action.payload;
        } else {
          return item;
        }
      });
      state.post = arr;
    },
    updateComment: (state, action) => {
      let arr = [...action.payload, ...state.comments];
      state.comments = arr;
    },
    updateCommentLikes: (state, action) => {
      let arr = state.comments.map((item) => {
        if (item._id === action.payload._id) {
          return action.payload;
        } else {
          return item;
        }
      });
      state.comments = arr;
    },
    updateSinglePost: (state, action) => {
      let arr = [...action.payload, ...state.singlePost];
      state.singlePost = arr;
    },
    updateSinglePostLike: (state, action) => {
      let arr = state.singlePost.map((item) => {
        if (item._id === action.payload._id) {
          return action.payload;
        } else {
          return item;
        }
      });
      state.singlePost = arr;
    },
    updateReplies: (state, action) => {
      let arr = [...action.payload, ...state.replies];
      state.replies = arr;
    },
    updateRepliesLikes: (state, action) => {
      let arr = state.replies.map((item) => {
        if (item._id === action.payload._id) {
          return action.payload;
        } else {
          return item;
        }
      });
      state.replies = arr;
    },
    setReplyOpen: (state, action) => {
      state.replyOpen = action.payload;
    },
    setCommentOpen: (state, action) => {
      state.commentOpen = action.payload;
    },
    logout: (state) => {
      state.newPost = false;
      state.user = false;
      state.post = [];
      state.comments = [];
      state.replies = [];
      state.homePE = pointerEvents[1];
      state.replyOpen = "";
      state.commentOpen = "";
    },
  },
});

export const {
  setWidth,
  setCurrPage,
  setInitLoadingTrue,
  setInitLoadingFalse,
  setHomePEAll,
  setHomePENone,
  setlightModeTrue,
  setlightModeFalse,
  setnewPostFalse,
  setnewPostTrue,
  setUser,
  setPost,
  setSinglePost,
  setComment,
  setReply,
  updatePost,
  deletePost,
  updatePostLike,
  updateSinglePost,
  updateSinglePostLike,
  updateComment,
  updateCommentLikes,
  updateReplies,
  updateRepliesLikes,
  setReplyOpen,
  setCommentOpen,
  logout,
} = Reducer.actions;

export default Reducer.reducer;
