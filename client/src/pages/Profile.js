import React, { useContext } from "react";
import { gql, useMutation } from "@apollo/client";
import { makeStyles } from "@material-ui/core/styles";
import useForm from "../customHooks/useForm";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Navbar from "../layout/Navbar";
import { AuthContext } from "../context/auth";
import Loading from "../Components/Loading";
import Avatar from "@material-ui/core/Avatar";
import { Grid } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import MessagePopup from "../Components/MessagePopup";

const UPDATE_USER = gql`
  mutation updateUser(
    $id: ID!
    $username: String
    $email: String
    $image: Upload
  ) {
    updateUser(id: $id, username: $username, email: $email, image: $image) {
      id
      username
      email
      imageURL
      points
      verified
      solvedProblems
    }
  }
`;

const UPDATE_PASSWORD = gql`
  mutation updatePassword(
    $id: ID!
    $oldPassword: String!
    $newPassword: String!
  ) {
    updatePassword(
      id: $id
      oldPassword: $oldPassword
      newPassword: $newPassword
    ) {
      id
      username
      email
      imageURL
      points
      verified
      solvedProblems
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  root: {
    border: "1px solid white",
    textAlign: "center",
    width: "80%",
    "& > *": {
      margin: "5px",
      "& > *": {
        margin: "20px",
      },
    },
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: "25ch",
  },
  image: { width: 200, height: 200, marginLeft: 100, marginTop: 30 },
  box: { border: "1px solid white", padding: "40px", margin: "10px" },
}));

export default function Profile({ history }) {
  const { user, updateUser } = useContext(AuthContext);
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [severity, setSeverity] = React.useState("success");

  const [updateUserProfile, { loading }] = useMutation(UPDATE_USER, {
    onCompleted({ updateUser: user }) {
      updateUser(user);
      setMessage("User Profile Updated!!");
      setSeverity("success");
      setOpen(true);
    },
    onError({ graphQLErrors }) {
      if (graphQLErrors) {
        graphQLErrors.forEach(({ message }) => {
          setMessage(message);
          setSeverity("error");
          setOpen(true);
        });
      }
    },
  });
  const [updatePassword, { loadingPass }] = useMutation(UPDATE_PASSWORD, {
    onCompleted({ updatePassword: user }) {
      updateUser(user);
      setMessage("Updated User Password !!");
      setSeverity("success");
      setOpen(true);
      resetFields();
    },
    onError({ graphQLErrors }) {
      if (graphQLErrors) {
        graphQLErrors.forEach(({ message }) => {
          setMessage(message);
          setSeverity("error");
          setOpen(true);
        });
      }
    },
  });
  const { formInputs, handleInputChange, handleSubmit, resetFields } = useForm(
    {
      email: "",
      username: "",
      file: null,
      oldPassword: "",
      newPassword: "",
    },
    () => {
      updateUserProfile({
        variables: {
          id: user.id,
          email: formInputs.email,
          username: formInputs.username,
          image: formInputs.file,
        },
      });
    }
  );
  const classes = useStyles();

  return loading || loadingPass ? (
    <Loading loading={loading || loadingPass} />
  ) : (
    <div>
      <Navbar tools getStarted home />
      <h1
        style={{
          color: "gold",
          textAlign: "center",
          marginBottom: "10px",
          fontFamily: "'Roboto',sans-serif",
        }}
      >
        UPDATE USER PROFILE
      </h1>
      <form
        onSubmit={handleSubmit}
        className={classes.root}
        style={{
          backgroundColor: "#1A202C",
          position: "relative",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Avatar
              className={classes.image}
              alt={user.username}
              src={`http://localhost:5000/uploads/${user.imageURL}`}
            />
            <div style={{ marginTop: 20, marginRight: 30 }}>
              <input
                style={{ display: "none" }}
                id="icon-button-file"
                type="file"
                name="file"
                onChange={handleInputChange}
              />

              <label htmlFor="icon-button-file" style={{ color: "white" }}>
                <IconButton aria-label="upload picture" component="span">
                  <PhotoCamera color="primary" fontSize="large" />
                </IconButton>
                Upload
              </label>
              {/* <input
                style={{ display: "none " }}
                accept="image/*"
                id="contained-button-file"
                multiple
                type="file"
              /> */}
              {/* <label htmlFor="contained-button-file">
                <Button variant="contained" color="primary" component="span">
                  Upload
                </Button>
              </label> */}
            </div>
            <Button
              variant="contained"
              type="submit"
              color="secondary"
              style={{ marginRight: 0 }}
            >
              Update Avatar
            </Button>
          </Grid>
          <Grid item xs={5} sm={5}>
            <TextField
              label={user.username}
              name="username"
              style={{ margin: 8 }}
              helperText="Enter the new UserName Here"
              onChange={handleInputChange}
              fullWidth
              value={formInputs.username}
              margin="normal"
            />
            <Button variant="contained" type="submit" color="secondary">
              Update Username
            </Button>
            <TextField
              label={user.email}
              name="email"
              type="email"
              style={{ margin: 8 }}
              helperText="Enter the new Email Here"
              onChange={handleInputChange}
              value={formInputs.email}
              fullWidth
              margin="normal"
            />
            <Button variant="contained" type="submit" color="secondary">
              Update Email
            </Button>

            <TextField
              label="Existing Password"
              name="oldPassword"
              type="password"
              style={{ margin: 8 }}
              helperText="Enter the Existing Password Here"
              onChange={handleInputChange}
              value={formInputs.oldPassword}
              fullWidth
              margin="normal"
            />
            <TextField
              label="New Password"
              name="newPassword"
              type="password"
              style={{ margin: 8 }}
              placeholder="Required"
              helperText="Enter the new Password Here"
              onChange={handleInputChange}
              value={formInputs.newPassword}
              fullWidth
              margin="normal"
            />
            <Button
              variant="contained"
              onClick={() =>
                updatePassword({
                  variables: {
                    id: user.id,
                    oldPassword: formInputs.oldPassword,
                    newPassword: formInputs.newPassword,
                  },
                })
              }
              color="secondary"
            >
              Update Password
            </Button>
          </Grid>
        </Grid>
      </form>

      <MessagePopup
        open={open}
        message={message}
        severity={severity}
        setOpen={setOpen}
        loading={loading}
      />
    </div>
  );
}
