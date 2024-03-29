import React from "react";
import {
  withStyles,
  LinearProgress,
  Paper,
  Typography,
  Button,
  Avatar,
} from "@mui/material";
import PropTypes from "prop-types";
import { Warning as WarningIcon } from "@mui/icons-material";
class ConfirmationModal extends React.Component {
  state = {
    isSubmitting: false,
  };

  onDelete = () => {
    this.setState({ isSubmitting: true }, () => {
      this.props.onDelete();
    });
  };

  render() {
    const { classes, handleClose } = this.props;

    return (
      <Paper className={classes.paperModal}>
        {this.state.isSubmitting && (
          <LinearProgress
            color="secondary"
            className={classes.linearLoaderModal}
          />
        )}

        <div className={classes.heading}>
          <Avatar className={classes.avatar}>
            <WarningIcon />
          </Avatar>
          <Typography align="center" variant="h5">
            Confirmation
          </Typography>
        </div>
        <Typography variant="body2" gutterBottom>
          Are you sure you want to permanently delete this {this.props.itemType}
          ?
        </Typography>
        <div>
          <Button onClick={this.onDelete} disabled={this.state.isSubmitting}>
            Yes
          </Button>
          <Button onClick={handleClose} disabled={this.state.isSubmitting}>
            No
          </Button>
        </div>
      </Paper>
    );
  }
}

ConfirmationModal.propTypes = {
  classes: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  itemType: PropTypes.string.isRequired,
};

const styles = (theme) => ({
  paperModal: {
    position: "absolute",
    padding: `${theme.spacing.unit * 2}px`,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  linearLoaderModal: {
    position: "absolute",
    top: "0",
    left: 0,
    width: "100%",
  },
  heading: {
    marginBottom: `${theme.spacing.unit}px`,
  },
  avatar: {
    margin: `${theme.spacing.unit}px auto`,
    backgroundColor: theme.palette.secondary.main,
  },
});

export default withStyles(styles)(ConfirmationModal);
