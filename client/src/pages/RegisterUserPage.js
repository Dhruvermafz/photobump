import React from "react";
import { connect } from "react-redux";
import {
  withStyles,
  Avatar,
  Paper,
  TextField,
  InputAdornment,
  Typography,
  Button,
  LinearProgress,
} from "@mui/material";
import { compose } from "redux";
import { useLocation as withRouter } from "react-router";
import { HowToReg } from "@mui/icons-material";
import PropTypes from "prop-types";
import CustomSnackbar from "../components/snackbar/CustomSnackbar";
import { registerUser } from "../async/auth";
import { setUser, setRegistered } from "../actions/auth";

class DisplayNameForm extends React.Component {
  constructor() {
    super();

    this.state = {
      displayName: "",
      isSubmitting: false,
      snackbarOpen: false,
      snackbarMessage: "",
    };
  }

  onDisplayNameChange = (e) => {
    this.setState({ displayName: e.target.value });
  };

  onSubmit = async (e) => {
    e.preventDefault();
    try {
      this.setState({ isSubmitting: true }, () => {});
      const { data: userData } = await registerUser(this.state.displayName);
      this.props.setUser(userData);
      this.props.setRegistered();
      this.props.history.push("/");
    } catch (e) {
      this.setState(
        {
          isSubmitting: false,
          snackbarMessage: e.response.data.error,
        },
        () => {
          this.onSnackbarOpen();
        }
      );
    }
  };

  onSnackbarOpen = () => {
    this.setState({ snackbarOpen: true }, () => {});
  };

  onSnackbarClose = () => {
    this.setState({ snackbarOpen: false }, () => {});
  };

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <main className={classes.layout}>
          <Paper className={classes.paper} elevation={1}>
            {this.state.isSubmitting && (
              <LinearProgress
                className={classes.linearProgress}
                color="secondary"
              />
            )}
            <Avatar className={classes.avatar}>
              <HowToReg />
            </Avatar>
            <Typography variant="h5">Display Name</Typography>
            <Typography
              align="center"
              variant="subtitle1"
              className={classes.subheading}
            >
              Thanks for authenticating. Please choose a display name to
              complete registration.
            </Typography>
            <form
              onSubmit={this.onSubmit}
              className={classes.container}
              noValidate
              autoComplete="off"
            >
              <TextField
                autoFocus
                required
                id="displayName"
                label="Display Name"
                className={classes.textField}
                margin="normal"
                onChange={this.onDisplayNameChange}
                inputProps={{ maxLength: 12 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {this.state.displayName.length}
                      /12
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                type="submit"
                disabled={
                  this.state.displayName.length < 4 ||
                  this.state.displayName.length > 12 ||
                  this.state.isSubmitting
                }
              >
                Complete Registration
              </Button>
            </form>
          </Paper>
        </main>
        <CustomSnackbar
          variant="warning"
          snackbarOpen={this.state.snackbarOpen}
          message={this.state.snackbarMessage}
          onSnackbarOpen={this.onSnackbarOpen}
          onSnackbarClose={this.onSnackbarClose}
        />
      </React.Fragment>
    );
  }
}

const styles = (theme) => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    width: "50%",
    margin: "0 auto",
    minHeight: "250px",
  },
  layout: {
    width: "auto",
    display: "block", // Fix IE11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  paper: {
    position: "relative",
    marginTop: theme.spacing.unit * 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${
      theme.spacing.unit * 3
    }px`,
  },
  linearProgress: {
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
  },
  subheading: {
    marginTop: theme.spacing.unit,
  },
  textField: {
    marginTop: theme.spacing.unit,
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: "90%",
  },
  button: {
    marginTop: "5%",
    width: "100%",
  },
});

DisplayNameForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(
  withStyles(styles),
  connect(null, { setUser, setRegistered })
)(withRouter(DisplayNameForm));
