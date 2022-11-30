import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Typography,
  Skeleton,
} from "@mui/material";
import {
  FavoriteRounded as FavoriteIcon,
  FavoriteBorderRounded as FavoriteOutlineIcon,
  MoreVert as MoreVertIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  ChatBubbleOutlineRounded as CommentIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import noImage from "../../Files/no-image.png";
import axios from "axios";
import {
  deletePost,
  setCommentOpen,
  setHomePEAll,
  setHomePENone,
  updatePostLike,
  updateSinglePostLike,
} from "../../Context/features/Reducer";
import CustomDialog from "./CustomDialog";
import useDate from "../useDate";

const CustomCardDesktop = ({ data, isSinglePost = false }) => {
  const dispatch = useDispatch();
  const lightMode = useSelector((state) => state.Reducer.lightMode);
  const homePE = useSelector((state) => state.Reducer.homePE);
  const width = useSelector((state) => state.Reducer.width);
  const user = useSelector((state) => state.Reducer.user);
  const commentOpen = useSelector((state) => state.Reducer.commentOpen);
  const [imageError, setImageError] = useState({
    error: false,
    loading: true,
    src: `/api/i/${data?.pic}`,
  });
  const [commentsCount, setCommentsCount] = useState(0);
  const [visible, setVisible] = useState(false);

  const cardContainerStyle = {
    width: "480px",
    bgcolor: lightMode ? "var(--lm-app-layout-bg)" : "var(--dm-app-layout-bg)",
    borderRadius: width >= 580 ? "10px" : "0px",
    border: lightMode
      ? width >= 580 && "1px solid var(--lm-border-c)"
      : width >= 580 && "1px solid var(--dm-border-c)",
    my: width >= 580 && "10px",
    overflow: "hidden",
    "@media (max-width:500px)": {
      width: "100vw",
    },
    transition: "all 0.4s ease-in-out",
  };
  useEffect(() => {
    if (commentOpen !== data._id) {
      setVisible(false);
    }
  }, [commentOpen]);
  const handleLikes = async (liked) => {
    try {
      const likeRes = await axios.put(
        `/api/p/lu_p?postId=${data._id}&liked=${liked}`
      );
      if (likeRes.data.status === 200) {
        if (isSinglePost === true) {
          dispatch(updateSinglePostLike(likeRes.data.data));
        } else {
          dispatch(updatePostLike(likeRes.data.data));
        }
      }
    } catch (error) {}
  };

  const getCommentsCount = async () => {
    const res = await axios.get(`/api/p/p_c_c?postId=${data._id}`);
    if (res.data.status === 200) {
      setCommentsCount((commentsCount) => (commentsCount = res.data.data));
    } else {
      setCommentsCount((commentsCount) => (commentsCount = 0));
    }
  };

  const handleDelete = async () => {
    if (data?.sender?._id === user._id) {
      await axios.delete(`/api/p/d_p?postId=${data._id}&img=${data.pic}`);
      dispatch(deletePost(data._id));
    }
  };

  useEffect(() => {
    getCommentsCount();
  }, []);

  useEffect(() => {
    if (visible && homePE === "all") {
      dispatch(setHomePENone());
    } else if (!visible && homePE === "none") {
      dispatch(setHomePEAll());
    }
  }, [visible]);

  const isLiked =
    data?.likes?.filter((val) => val?._id === user._id).length > 0
      ? true
      : false;
  const timeline = useDate(data.createdAt);
  return (
    <>
      <div>
        <Card sx={cardContainerStyle} id={`CustomCard--${data._id}`}>
          <CardHeader
            avatar={
              <Avatar
                aria-label="post--logo"
                src={data?.sender?.pic}
                referrerPolicy="no-referrer"
                loading="lazy"
              />
            }
            action={
              <IconButton aria-label="settings" onClick={handleDelete}>
                <MoreVertIcon />
              </IconButton>
            }
            title={data?.sender?.name}
            subheader={timeline.string}
          />
          <Skeleton
            variant="rectangular"
            width="100%"
            height={400}
            hidden={!imageError.loading}
          />
          <CardMedia
            component="img"
            onError={() => {
              setImageError({
                ...imageError,
                ...{ error: true, loading: false },
              });
            }}
            onLoad={() => {
              setImageError({
                ...imageError,
                ...{ loading: false },
              });
            }}
            onDoubleClick={() => {
              isLiked ? handleLikes(false) : handleLikes(true);
            }}
            image={imageError.error ? noImage : `/api/i/${data?.pic}`}
            loading="lazy"
            referrerPolicy="no-referrer"
            alt="image"
            sx={{
              minHeight: imageError.loading ? "0" : "200px",
              maxHeight: imageError.loading ? "0" : "540px",
              objectFit: "contain",
              visibility: imageError.loading ? "hidden" : "visible",
            }}
          />
          <CardActions disableSpacing>
            {isLiked ? (
              <IconButton
                aria-label="like"
                sx={{ color: "red" }}
                size="large"
                onClick={() => {
                  handleLikes(false);
                }}
              >
                <FavoriteIcon sx={{ width: "30px", height: "30px" }} />
              </IconButton>
            ) : (
              <IconButton
                aria-label="like"
                size="large"
                onClick={() => {
                  handleLikes(true);
                }}
              >
                <FavoriteOutlineIcon sx={{ width: "30px", height: "30px" }} />
              </IconButton>
            )}
            <IconButton
              aria-label="comment"
              sx={{ scale: "-1 1" }}
              size="large"
              disabled={commentsCount === null}
              onClick={() => {
                dispatch(setCommentOpen(data._id));
                setVisible((visible) => (visible = !visible));
              }}
            >
              <CommentIcon sx={{ width: "30px", height: "30px" }} />
            </IconButton>
            <IconButton
              aria-label="save"
              sx={{ marginLeft: "auto" }}
              size="large"
            >
              <BookmarkIcon sx={{ width: "30px", height: "30px" }} />
              {/* <BookmarkBorderIcon  sx={{ width: "30px", height: "30px" }}/> */}
            </IconButton>
          </CardActions>
          <CardContent sx={{ paddingBlock: 0 }}>
            <Typography variant="body2" color="text.secondary">
              {`${data?.likes.length} ${
                data?.likes.length < 2 ? "like" : "likes"
              }`}
            </Typography>
            {data?.head ? (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: "300" }}
              >
                <span style={{ fontWeight: "900" }}>{data?.sender?.name}</span>
                {` ${data?.head}`}
              </Typography>
            ) : (
              <></>
            )}
            {commentsCount !== null && commentsCount !== 0 ? (
              <Typography
                component="a"
                sx={{ cursor: "pointer", textDecoration: "none" }}
                variant="body2"
                color="text.secondary"
                onClick={() => {
                  dispatch(setCommentOpen(data._id));
                  setVisible((visible) => (visible = !visible));
                }}
              >
                view all {commentsCount} comments
              </Typography>
            ) : (
              <></>
            )}
          </CardContent>
        </Card>
      </div>
      <CustomDialog
        visible={visible}
        setVisible={setVisible}
        setCommentsCount={setCommentsCount}
        postId={visible ? data._id : null}
        postData={data}
      />
    </>
  );
};

export default CustomCardDesktop;
