import {
  Avatar,
  Box,
  Button,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useDate from "../useDate";
import {
  FavoriteRounded as FavoriteIcon,
  FavoriteBorderRounded as FavoriteOutlineIcon,
} from "@mui/icons-material";
import {
  setReply,
  setReplyOpen,
  updateCommentLikes,
} from "../../Context/features/Reducer";
import CustomReplyDialog from "./CustomReplyDialog";

const CustomComment = ({
  comment,
  setIsReply,
  setIsReplyTag,
  setIsReplyComId,
  reFetchRepliesCount,
  setReFetchRepliesCount,
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.Reducer.user);
  const lightMode = useSelector((state) => state.Reducer.lightMode);
  const replyOpen = useSelector((state) => state.Reducer.replyOpen);
  const [repliesCount, setRepliesCount] = useState(0);
  const [repliesVisible, setRepliesVisible] = useState(false);

  const getRepliesCount = async () => {
    const res = await axios.get(`/api/p/p_c_r_c?comId=${comment._id}`);
    if (res.data.status === 200) {
      setRepliesCount((repliesCount) => (repliesCount = res.data.data));
    } else {
      setRepliesCount((repliesCount) => (repliesCount = 0));
    }
    setReFetchRepliesCount(false);
  };
  useEffect(() => {
    if (reFetchRepliesCount === true) getRepliesCount();
  }, [reFetchRepliesCount]);

  const handleLikes = async (liked) => {
    try {
      const likeRes = await axios.put(
        `/api/p/lu_p_c?comId=${comment._id}&liked=${liked}`
      );
      if (likeRes.data.status === 200) {
        dispatch(updateCommentLikes(likeRes.data.data));
      }
    } catch (error) {}
  };

  const timeline = useDate(comment?.createdAt).string;
  const isLiked =
    comment?.likes?.filter((val) => val._id === user._id).length > 0
      ? true
      : false;
  useEffect(() => {
    if (replyOpen !== comment._id) {
      setRepliesVisible(false);
    }
  }, [replyOpen]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflowX: "hidden",
      }}
    >
      <Box sx={{ width: "100%", p: 1 }}>
        <Grid container spacing={1.5}>
          <Grid
            item
            xs={2}
            sx={{
              display: "flex",
              alignItems: "flex-start !important",
              justifyContent: "center",
            }}
          >
            <Avatar
              aria-label="comment--logo"
              src={comment?.sender?.pic}
              referrerPolicy="no-referrer"
              loading="lazy"
            />
          </Grid>
          <Grid item xs={8.5} sx={{ fontSize: ".8rem" }}>
            <Typography sx={{ display: "flex", flexDirection: "row" }}>
              <span
                style={{
                  marginRight: ".5rem",
                  fontWeight: "700",
                }}
              >
                {comment?.sender?.tag}
              </span>
              <span
                style={{
                  color: lightMode
                    ? "var(--dm-border-c)"
                    : "var(--lm-border-c)",
                }}
              >
                {timeline}
              </span>
            </Typography>
            <Typography>{comment?.content}</Typography>
            <Typography
              onClick={() => {
                setIsReply(true);
                setIsReplyTag(
                  (isReplyTag) => (isReplyTag = comment?.sender?.tag)
                );
                setIsReplyComId(
                  (isReplyComId) => (isReplyComId = comment?._id)
                );
              }}
            >
              <span
                style={{
                  fontSize: ".8rem",
                  cursor: "pointer",
                  color: lightMode ? "blue" : "lightsteelblue",
                }}
              >
                Reply
              </span>
            </Typography>
            {repliesCount !== null && repliesCount !== 0 ? (
              <Button
                component="button"
                size="small"
                variant="body2"
                color="text.secondary"
                onClick={() => {
                  setRepliesVisible((visible) => (visible = !visible));
                  dispatch(setReplyOpen(comment._id));
                  dispatch(setReply([]));
                }}
              >
                {repliesVisible
                  ? `—— hide ${repliesCount} more ${
                      repliesCount < 2 ? "reply" : "replies"
                    }`
                  : `—— view ${repliesCount} more ${
                      repliesCount < 2 ? "reply" : "replies"
                    }`}
              </Button>
            ) : (
              <></>
            )}
          </Grid>
          <Grid
            item
            xs={1.5}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {isLiked ? (
              <IconButton
                aria-label="like"
                sx={{ color: "red" }}
                onClick={() => {
                  handleLikes(false);
                }}
              >
                <FavoriteIcon sx={{ width: "22px", height: "22px" }} />
              </IconButton>
            ) : (
              <IconButton
                aria-label="like"
                onClick={() => {
                  handleLikes(true);
                }}
              >
                <FavoriteOutlineIcon sx={{ width: "22px", height: "22px" }} />
              </IconButton>
            )}
            <Typography variant="body2" color="text.secondary">
              {comment?.likes?.length}
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <CustomReplyDialog
        visible={repliesVisible}
        setVisible={setRepliesVisible}
        comId={repliesVisible ? comment._id : null}
      />
    </div>
  );
};

export default CustomComment;
