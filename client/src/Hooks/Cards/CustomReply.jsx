import { Avatar, Box, Grid, IconButton, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useDate from "../useDate";
import {
  FavoriteRounded as FavoriteIcon,
  FavoriteBorderRounded as FavoriteOutlineIcon,
} from "@mui/icons-material";
import { updateRepliesLikes } from "../../Context/features/Reducer";

const CustomReply = ({ reply, visible }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.Reducer.user);
  const lightMode = useSelector((state) => state.Reducer.lightMode);
  const width = useSelector((state) => state.Reducer.width);
  const handleLikes = async (liked) => {
    try {
      const likeRes = await axios.put(
        `/api/p/lu_p_c_r?repId=${reply._id}&liked=${liked}`
      );
      if (likeRes.data.status === 200) {
        dispatch(updateRepliesLikes(likeRes.data.data));
      }
    } catch (error) {}
  };

  const timeline = useDate(reply?.createdAt).string;
  const isLiked =
    reply?.likes?.filter((val) => val._id === user._id).length > 0
      ? true
      : false;
  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <Grid container spacing={1.5} alignItems="center">
        <Grid item xs={2} sx={{ display: "grid", placeItems: "center" }}>
          <Avatar
            src={reply?.sender?.pic}
            referrerPolicy="no-referrer"
            loading="lazy"
            sx={{ width: "30px", height: "30px" }}
          />
        </Grid>
        <Grid item xs={8.5} sx={{ fontSize: ".8rem" }}>
          <Typography sx={{ display: "flex", flexDirection: "row" }}>
            <span
              style={{
                marginRight: ".5rem",
                fontWeight: "700",
                fontSize: ".9rem",
              }}
            >
              {reply?.sender?.tag}
            </span>
            <span
              style={{
                color: lightMode ? "var(--dm-border-c)" : "var(--lm-border-c)",
                fontSize: ".9rem",
              }}
            >
              {timeline}
            </span>
          </Typography>
          <Typography sx={{ fontSize: ".9rem" }}>{reply?.content}</Typography>
        </Grid>
        <Grid
          item
          xs={1.5}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
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
              <FavoriteIcon sx={{ width: "18px", height: "18px" }} />
            </IconButton>
          ) : (
            <IconButton
              aria-label="like"
              onClick={() => {
                handleLikes(true);
              }}
            >
              <FavoriteOutlineIcon sx={{ width: "18px", height: "18px" }} />
            </IconButton>
          )}
          <Typography variant="body2" color="text.secondary">
            {reply?.likes?.length}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CustomReply;
