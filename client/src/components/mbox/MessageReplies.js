import React from "react";
import {
  withStyles,
  Paper,
  List,
  ListItem,
  ListItemText,
  Avatar,
  OutlinedInput,
  Button,
  InputAdornment,
} from "@mui/material";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import moment from "moment";
import { SendOutlined as SendOutlinedIcon } from "@mui/icons-material";
export class MessageReplies extends React.Component {
  constructor() {
    super();

    this.state = {
      body: "",
    };

    this.bottomRef = React.createRef();
  }

  componentDidMount() {
    this.bottomRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.message.replies !== prevProps.message.replies) {
      this.setState(
        {
          body: "",
        },
        () => {
          this.bottomRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "nearest",
          });
        }
      );
    }
  }

  onSubmit = async (e) => {
    e.preventDefault();
    await this.props.onSubmitMessageReply(this.state.body);
  };

  onBodyChange = (e) => {
    this.setState({ body: e.target.value }, () => {});
  };

  loadPrevious = async () => {
    try {
      await this.props.setPrevMessageReplies();
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <Paper className={classes.root}>
        <List classes={{ root: classes.listRoot }}>
          <ListItem>
            <Button
              className={classes.loadMoreButton}
              variant="outlined"
              size="small"
              onClick={this.loadPrevious}
              disabled={
                this.props.message.replies.length < 5 ||
                !this.props.hasMoreReplies
              }
            >
              Load Previous
            </Button>
          </ListItem>
          {this.props.message &&
            this.props.message.replies.map((reply) => (
              <ListItem key={reply._id}>
                <Link to={`/profile/${reply._owner.displayName}`}>
                  <Avatar src={reply._owner.profilePhoto} />
                </Link>
                <ListItemText primary={reply.body} />
                <ListItemText
                  classes={{ root: classes.dateText }}
                  secondary={moment(reply.createdAt).fromNow()}
                />
              </ListItem>
            ))}
          <div ref={this.bottomRef} />
        </List>
        <form onSubmit={this.onSubmit} className={classes.form}>
          <OutlinedInput
            multiline
            labelWidth={-25}
            rows={1}
            onChange={this.onBodyChange}
            value={this.state.body}
            disabled={this.props.isSending}
            inputProps={{ maxLength: 120 }}
            endAdornment={
              <InputAdornment position="end">
                {this.state.body.length}
                /120
              </InputAdornment>
            }
          />
          <Button
            type="submit"
            variant="contained"
            disabled={this.props.isSending || this.state.body.length < 1}
          >
            <SendOutlinedIcon className={classes.leftIcon} />
            Reply
          </Button>
        </form>
      </Paper>
    );
  }
}

MessageReplies.propTypes = {
  classes: PropTypes.object.isRequired,
  message: PropTypes.object.isRequired,
  onSubmitMessageReply: PropTypes.func.isRequired,
  isSending: PropTypes.bool.isRequired,
  setPrevMessageReplies: PropTypes.func.isRequired,
  currentMessagePage: PropTypes.number.isRequired,
  hasMoreReplies: PropTypes.bool.isRequired,
};

const styles = (theme) => ({
  root: {
    width: "100%",
    height: "348px",
    position: "relative",
    display: "flex",
    flexDirection: "column",
  },
  listRoot: {
    height: "252px",
    overflowY: "scroll",
  },
  form: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
  leftIcon: {
    marginRight: `${theme.spacing.unit}px`,
  },
  dateText: {
    textAlign: "right",
  },
  loadMoreButton: {
    margin: "0 auto",
  },
});

export default withStyles(styles)(MessageReplies);
