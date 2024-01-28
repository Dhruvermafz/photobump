import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@mui/material";
import AddPostForm from "../components/post/AddPostForm";

export class AddPostPage extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <main className={classes.layout}>
          <AddPostForm view="page" />
        </main>
      </div>
    );
  }
}

const styles = (theme) => ({
  root: {
    margin: `${theme.spacing.unit * 3}px 0`,
  },
});

AddPostPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddPostPage);
