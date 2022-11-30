import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  TextField,
} from "@mui/material";
import ReactLoading from "react-loading";
import { useDispatch, useSelector } from "react-redux";
import {
  setInitLoadingFalse,
  setInitLoadingTrue,
  setnewPostFalse,
  updatePost,
} from "../../Context/features/Reducer";
import { Stack } from "@mui/system";
import swal from "sweetalert";
import axios from "axios";
import Resizer from "react-image-file-resizer";
import useDebounce from "../useDebounce";
export default function AlertDialog({ children }) {
  const initialData = {
    userData: {
      head: "",
      body: "",
      pic: "",
      tags: [],
    },
    tagsList: [],
    searchText: "",
  };
  const newPost = useSelector((state) => state.Reducer.newPost);
  const lightMode = useSelector((state) => state.Reducer.lightMode);
  const swalOptions = {
    buttons: false,
    closeOnEsc: false,
    closeOnClickOutside: false,
    className: lightMode ? "light" : "dark",
  };
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [userData, setUserData] = useState(initialData.userData);
  const [tagsList, setTagsList] = useState(initialData.tagsList);
  const [previewSource, setPreviewSource] = useState("");
  const [img, setImg] = useState("");
  const [searchText, setSearchText] = useState(initialData.searchText);

  const debouncedSearch = useDebounce(searchText);

  const handleClose = () => {
    setPage(1);
    setUserData(initialData.userData);
    setTagsList(initialData.tagsList);
    setSearchText(initialData.searchText);
    setPreviewSource("");
    setImg("");
    dispatch(setnewPostFalse());
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
    return previewSource;
  };

  const handleSearch = async (value) => {
    setSearching(true);
    try {
      if (value.length > 0) {
        const searchRes = await axios.get(`/api/u/s?search=${value}`);
        if (searchRes.data.status === 200) {
          setTagsList((tagsList) => (tagsList = searchRes.data.data));
        }
      } else {
        setTagsList((tagsList) => (tagsList = []));
      }
    } catch (error) {
      swal({
        icon: "error",
        text: "Internal Server Error",
        timer: 2000,
        ...swalOptions,
      });
    }
    setSearching(false);
  };

  const handleChange = (mode, value) => {
    switch (mode) {
      case 1:
        setUserData({ ...userData, ...{ head: value } });
        break;
      case 2:
        setUserData({ ...userData, ...{ body: value } });
        break;
      case 3:
        if (value) setImg((img) => (img = value));
        break;
      case 4:
        setSearchText((searchText) => (searchText = value));
        break;
      default:
        setUserData(initialData.userData);
        setTagsList(initialData.tagsList);
        setSearchText(initialData.searchText);
        setPreviewSource("");
        setImg("");
        break;
    }
  };

  const handleToggle = (value) => () => {
    const currentIndex = userData.tags.indexOf(value);
    const newChecked = [...userData.tags];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setUserData({ ...userData, ...{ tags: newChecked } });
  };

  const resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        280,
        280,
        "JPEG",
        90,
        0,
        (uri) => {
          resolve(uri);
        },
        "blob"
      );
    });

  const handleSubmit = async () => {
    setLoading(true);
    dispatch(setInitLoadingTrue());
    try {
      swal({
        text: "Uploading Image...",
        ...swalOptions,
      });
      let myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", "Bearer eyJ0eXAiOiJKV1QiLCJh");
      const fd = new FormData();
      fd.append("image", await resizeFile(img), img.name);
      const uploadRes = await axios.post("/api/i/u_s", fd);
      swal({
        text: "Creating Post...",
        ...swalOptions,
      });
      setUserData({ ...userData, ...{ pic: uploadRes.data.data } });
      const createData = {
        head: userData.head,
        body: userData.body,
        pic: uploadRes.data.data,
        tags: userData.tags,
      };
      const createRes = await axios.post("/api/p/c_p", createData);
      if (createRes.data.status === 200) {
        dispatch(updatePost([createRes.data.data]));
        handleClose();
        swal({
          icon: "success",
          text: "Post Created",
          timer: 2000,
          ...swalOptions,
        });
      }
    } catch (error) {
      swal({
        icon: "error",
        text: "Internal Server Error",
        timer: 2000,
        ...swalOptions,
      });
    }
    dispatch(setInitLoadingFalse());
    setLoading(false);
  };

  const Page1 = () => {
    const emptyImageStyle = {
      width: "500px",
      height: "300px",
      my: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    };
    const imageStyle = {
      width: "500px",
      overflowY: "scroll",
      my: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    };
    return (
      <Box sx={{ my: 2 }}>
        <Grid
          container
          rowSpacing={1}
          justifyContent="center"
          alignItems="center"
        >
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="create--file"
              label="Choose Image"
              name="create--file"
              type="file"
              inputProps={{ accept: ".png,.jpg,.jpeg" }}
              InputLabelProps={{ shrink: true }}
              onChange={(e) => {
                handleChange(3, e.target.files[0]);
              }}
              disabled={loading}
            />
          </Grid>
          {!img ? (
            <Grid item xs={12} sx={emptyImageStyle}>
              Image Preview
            </Grid>
          ) : (
            <Grid item xs={12} sx={imageStyle}>
              <img
                src={previewFile(img)}
                alt="create--pic"
                width="100%"
                style={{
                  objectFit: "scale-down",
                }}
              />
            </Grid>
          )}
        </Grid>
      </Box>
    );
  };

  const Page2 = () => {
    return (
      <Box sx={{ my: 2 }}>
        <Grid
          container
          spacing={1.5}
          justifyContent="center"
          alignItems="center"
        >
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="create--head"
              label="Heading"
              name="create--head"
              type="text"
              value={userData.head}
              onChange={(e) => handleChange(1, e.target.value)}
              InputLabelProps={{ shrink: true }}
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="create--body"
              label="Body"
              name="create--body"
              type="text"
              value={userData.body}
              onChange={(e) => handleChange(2, e.target.value)}
              InputLabelProps={{ shrink: true }}
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row" spacing={1}>
              {userData.tags?.map((tag) => {
                return (
                  <Chip
                    avatar={
                      <Avatar
                        alt={tag?.name}
                        src={tag.pic}
                        referrerPolicy="no-referrer"
                      />
                    }
                    label={tag?.name}
                  />
                );
              })}
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="create--search"
              label="Search Users"
              name="create--search"
              type="text"
              value={searchText}
              onChange={(e) => handleChange(4, e.target.value)}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                endAdornment: (
                  <InputAdornment
                    position="end"
                    sx={{
                      width: "10%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {searching ? (
                      <ReactLoading
                        type="spin"
                        color="#0000FF"
                        width={30}
                        className="react-loader"
                      />
                    ) : (
                      <></>
                    )}
                  </InputAdornment>
                ),
              }}
              disabled={loading}
            />
            {tagsList ? (
              <List
                dense
                sx={{
                  width: "100%",
                }}
              >
                {tagsList?.map((tag, index) => {
                  const labelId = `create--tag-list-${index}`;
                  return (
                    <ListItem
                      key={tag._id}
                      secondaryAction={
                        <Checkbox
                          edge="end"
                          onChange={handleToggle(tag)}
                          checked={
                            userData.tags.filter((val) => val._id === tag._id)
                              .length > 0
                          }
                          inputProps={{ "aria-labelledby": labelId }}
                        />
                      }
                      disablePadding
                    >
                      <ListItemButton>
                        <ListItemAvatar>
                          <Avatar
                            alt={tag.name}
                            src={tag.pic}
                            referrerPolicy="no-referrer"
                          />
                        </ListItemAvatar>
                        <ListItemText
                          id={labelId}
                          primary={tag.name}
                          secondary={`@${tag.tag}`}
                        />
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
            ) : (
              <></>
            )}
          </Grid>
        </Grid>
      </Box>
    );
  };

  useEffect(() => {
    handleSearch(debouncedSearch);
  }, [debouncedSearch]);

  return (
    <>
      {children}
      <Dialog
        open={newPost}
        onClose={handleClose}
        fullWidth
        sx={{ backdropFilter: "var(--blur-0-3)" }}
      >
        <DialogTitle>Create New Post</DialogTitle>
        <DialogContent>{page === 1 ? Page1() : Page2()}</DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error" disabled={loading}>
            Cancel
          </Button>
          {page === 1 ? (
            <Button onClick={() => setPage(2)} disabled={loading || !img}>
              Next
            </Button>
          ) : (
            <>
              <Button onClick={() => setPage(1)} disabled={loading}>
                Back
              </Button>
              <Button onClick={handleSubmit} disabled={loading}>
                Create
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}
