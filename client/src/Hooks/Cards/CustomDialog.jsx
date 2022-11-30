import {
  Avatar,
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import ReactLoading from "react-loading";
import CustomComment from "./CustomComment";
import {
  setComment,
  updateComment,
  updateReplies,
} from "../../Context/features/Reducer";
import CustomSkeleton from "./CustomSkeleton";

const CustomDialog = ({
  visible,
  setVisible,
  postId = null,
  setCommentsCount,
}) => {
  const dispatch = useDispatch();
  const width = useSelector((state) => state.Reducer.width);
  const lightMode = useSelector((state) => state.Reducer.lightMode);
  const user = useSelector((state) => state.Reducer.user);
  const comments = useSelector((state) => state.Reducer.comments);
  const replies = useSelector((state) => state.Reducer.replies);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isReplyComId, setIsReplyComId] = useState(null);
  const [isReply, setIsReply] = useState(false);
  const [reFetchRepliesCount, setReFetchRepliesCount] = useState(true);
  const [isReplyTag, setIsReplyTag] = useState("");
  const [myCom, setMyCom] = useState("");

  const handleClose = () => {
    setIsReply(false);
    setIsReplyTag("");
    setIsReplyComId(null);
    setVisible((visible) => (visible = !visible));
    dispatch(setComment([]));
  };
  const handleCloseIsReply = () => {
    setIsReply(false);
    setIsReplyTag("");
    setIsReplyComId(null);
  };
  const controller = new AbortController();
  const getComments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/p/p_c?postId=${postId}`, {
        signal: controller.signal,
      });
      if (res.data.status === 200) {
        dispatch(setComment(res.data.data));
      }
    } catch (error) {}
    setLoading(false);
    setReFetchRepliesCount(true);
  };
  useEffect(() => {
    if (postId) getComments();
    return () => {
      controller.abort();
    };
  }, [postId]);

  const style_main_container = {
    position: "fixed",
    display: "flex",
    justifyContent: "center",
    top: visible ? "0" : "3000px",
    transition: "all .7s ease-in-out",
    left: "0",
    height: "100vh",
    width: "100vw",
    zIndex: "190",
    pointerEvents: "all",
    backdropFilter: "var(--blur-5)",
    overflowY: "scroll",
  };

  const style_main_wrapper = {
    alignItems: "center",
    background: lightMode ? "var(--white)" : "var(--dm-combox-c)",
    minHeight: "500px",
    position: "relative",
    flexDirection: "column",
    overflowY: "scroll",
  };

  const style_header_container = {
    width: "100%",
    height: "4.5rem",
    paddingBlock: "1rem",
    position: "sticky",
    top: "0",
    display: "flex",
    alignItems: "center",
    background: lightMode ? "var(--dm-app-layout-c)" : "var(--dm-combox)",
    zIndex: "200",
    boxShadow: "0px 1px 5px rgba(0, 0, 0, 1)",
  };

  const style_header_body = {
    px: 2,
    fontWeight: "500",
  };

  const style_myrep_container = {
    width: width >= 600 ? (width >= 800 ? "50%" : "75%") : "100%",
    p: 1,
    position: "fixed",
    bottom: "0",
    zIndex: "200",
    background: lightMode ? "var(--dm-app-layout-c)" : "var(--dm-combox)",
  };

  const style_close_button = {
    position: "fixed",
    top: "0",
    right: "0",
    m: 1,
    zIndex: "201",
  };

  const handleComment = async () => {
    setSending(true);
    try {
      const res = await axios.put(`/api/p/r_p?postId=${postId}`, {
        content: myCom,
      });
      if (res.data.status === 200) {
        setMyCom("");
        setCommentsCount(comments.length + 1);
        dispatch(updateComment([res.data.data]));
      }
    } catch (error) {}
    setSending(false);
  };

  const handleReply = async () => {
    setSending(true);
    try {
      const res = await axios.put(`/api/p/r_p_c?comId=${isReplyComId}`, {
        content: myCom,
      });
      if (res.data.status === 200) {
        setMyCom("");
        setIsReply(false);
        setIsReplyTag("");
        setIsReplyComId(null);
        if (replies[0].com === res.data.data.com)
          dispatch(updateReplies([res.data.data]));
      }
    } catch (error) {}
    setReFetchRepliesCount(true);
    setSending(false);
  };
  return (
    <div style={style_main_container}>
      <div
        className={`d-flex ${
          width >= 600 ? (width >= 850 ? "w-50" : "w-75") : "w-100"
        }`}
        style={style_main_wrapper}
      >
        <div style={style_header_container}>
          <Typography variant="h4" sx={style_header_body}>
            Comments
          </Typography>
        </div>
        <Box sx={style_myrep_container}>
          <Grid container>
            {isReply ? (
              <Grid
                item
                xs={12}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Typography sx={{ px: 1 }}>Replying to {isReplyTag}</Typography>
                <IconButton onClick={handleCloseIsReply}>
                  <ClearRoundedIcon />
                </IconButton>
              </Grid>
            ) : (
              <></>
            )}

            <Grid item xs={12}>
              <TextField
                fullWidth
                placeholder={`${isReply ? "Reply" : "Comment"} as ${
                  user.tag
                }...`}
                InputLabelProps={{ shrink: true }}
                disabled={sending}
                value={myCom}
                onChange={(e) => setMyCom((myCom) => (myCom = e.target.value))}
                onKeyUpCapture={(e) => {
                  if (e.key === "Enter" && myCom?.length > 0) {
                    isReply ? handleReply() : handleComment();
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Avatar
                        aria-label="comment-myRes--logo"
                        src={user?.pic}
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      {sending ? (
                        <ReactLoading
                          type="spin"
                          color="#0000FF"
                          width={30}
                          className="react-loader"
                        />
                      ) : (
                        <Button onClick={isReply ? handleReply : handleComment}>
                          {isReply ? "reply" : "post"}
                        </Button>
                      )}
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ width: "100%", marginBottom: "5rem", marginTop: "1rem" }}>
          {loading ? (
            [1, 2, 3, 4, 5, 6, 7, 8].map((val) => (
              <CustomSkeleton
                key={`customCommentSkeleton-${val}`}
                isComment={true}
              />
            ))
          ) : comments.length === 0 ? (
            <div
              style={{
                display: "grid",
                width: "100%",
                height: "100px",
                placeItems: "center",
                textAlign: "center",
              }}
            >
              No comments
            </div>
          ) : (
            comments?.map((comment) => {
              return (
                <CustomComment
                  key={comment._id}
                  comment={comment}
                  setIsReplyTag={setIsReplyTag}
                  setIsReply={setIsReply}
                  setIsReplyComId={setIsReplyComId}
                  reFetchRepliesCount={reFetchRepliesCount}
                  setReFetchRepliesCount={setReFetchRepliesCount}
                />
              );
            })
          )}
        </Box>
        <IconButton onClick={handleClose} sx={style_close_button}>
          <ClearRoundedIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default CustomDialog;
