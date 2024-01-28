import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { green, amber } from "@mui/material/colors";
import {
  IconButton,
  Snackbar,
  SnackbarContent,
  withStyles,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

const styles1 = (theme) => ({
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.primary.dark,
  },
  warning: {
    backgroundColor: amber[700],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing.unit,
  },
  message: {
    display: "flex",
    alignItems: "center",
  },
});

function MySnackbarContent(props) {
  const { classes, className, message, onClose, variant, ...other } = props;
  const Icon = variantIcon[variant];

  return (
    <SnackbarContent
      className={classNames(classes[variant], className)}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={classNames(classes.icon, classes.iconVariant)} />
          {message}
        </span>
      }
      action={[
        <IconButton
          key="close"
          aria-label="Close"
          color="inherit"
          className={classes.close}
          onClick={onClose}
        >
          <CloseIcon className={classes.icon} />
        </IconButton>,
      ]}
      {...other}
    />
  );
}

MySnackbarContent.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  message: PropTypes.node,
  onClose: PropTypes.func,
  variant: PropTypes.oneOf(["success", "warning", "error", "info"]).isRequired,
};

const MySnackbarContentWrapper = withStyles(styles1)(MySnackbarContent);

const styles2 = (theme) => ({
  margin: {
    margin: theme.spacing.unit,
  },
});

class CustomSnackbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: this.props ? this.props.snackbarOpen : false,
    };
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({ open: false });
  };

  render() {
    return (
      <div>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          open={this.props.snackbarOpen}
          autoHideDuration={6000}
          onClose={this.props.onSnackbarClose}
        >
          <MySnackbarContentWrapper
            onClose={this.props.onSnackbarClose}
            variant={this.props.variant}
            message={this.props.message}
          />
        </Snackbar>
      </div>
    );
  }
}

CustomSnackbar.propTypes = {
  classes: PropTypes.object.isRequired,
  variant: PropTypes.oneOf(["success", "warning", "error", "info"]),
  message: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
    PropTypes.node,
  ]),
  onSnackbarOpen: PropTypes.func,
  onSnackbarClose: PropTypes.func,
  snackbarOpen: PropTypes.bool,
};

export default withStyles(styles2)(CustomSnackbar);
