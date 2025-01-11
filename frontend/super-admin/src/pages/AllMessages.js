import React, { useEffect, useRef, useState } from "react";
import { Card, Col, Row, Form, Badge } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { BsClock, BsPaperclip, BsPlus, BsSearch } from "react-icons/bs";
import Select from "react-select";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { BiPaperPlane } from "react-icons/bi";
import CardComponent from "../components/CardComponent";
import TextareaAutosize from "react-textarea-autosize";
import moment from "moment";
import {
  AddnewUsertoChat,
  getAllMessages,
  getMessagesMarkRead,
  getNewUserChat,
  getSingleMessages,
} from "../services/authapi";
import Modaljs from "../components/Modal";
import { Formik } from "formik";
import { selectUser } from "../features/auth/authSlice";
import { useSelector } from "react-redux";
import { socket } from "../context/sockets";
import ImageViewer from "../components/ImageViewer";
import { addMessageSchema } from "../utils/formSchema";
import { toast } from "react-toastify";

const AllMessages = () => {
  const { user } = useSelector(selectUser);
  const [messages, setMessages] = useState([]);
  const [singleMessage, setSingleMessage] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [newImage, setNewImage] = useState(null);
  const chatWindowRef = useRef(null);
  const [allUserData, setAllUserData] = useState([]);
  const [messageData, setMessageData] = useState(false);
  const [search, setSearch] = useState("");
  const [messagesLists, setMessagesLists] = useState([]);
  const [receiverId, setReceiverId] = useState(null);

  const handleSendMessage = (e) => {
    e.preventDefault();
    socket.emit("chat", {
      senderId: user.id,
      message: newMessage,
      receiverId: receiverId,
    });
    handlerMessage(receiverId);
    setNewImage("");
    setNewMessage("");
  };

  const fetchMessagesData = async () => {
    const res = await getAllMessages();
    if (res.status) {
      setMessagesLists(res.data);
    } else {
      setMessagesLists([]);
    }
  };
  const handlerMessage = async (id) => {
    const res = await getSingleMessages(id);
    await getMessagesMarkRead(id);
    if (res.status) {
      setSingleMessage(res.data);
      setReceiverId(id);
      fetchMessagesData();
    } else {
      setSingleMessage([]);
    }
  };

  const fetchAllUsersData = async () => {
    const res = await getNewUserChat();
    if (res.status) {
      setAllUserData(res.data);
    } else {
      setAllUserData([]);
    }
  };

  const results = !search
    ? messagesLists
    : messagesLists.filter(
        (item) =>
          item?.message_content
            ?.toLowerCase()
            .includes(search.toLocaleLowerCase()) ||
          item?.sender_details?.name
            ?.toLowerCase()
            .includes(search.toLocaleLowerCase())
      );

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = values.user_id;
    // return console.log('sData', sData)
    const res = await AddnewUsertoChat(sData);
    if (res.status) {
      toast.success(res.message);
      resetForm();
      setMessageData(false);
    } else {
      toast.error(res.message);
    }
    setSubmitting(false);
    fetchMessagesData();
  };

  const handleChange = (event) => {
    setSearch(event.target.value);
  };

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
    fetchMessagesData();
    fetchAllUsersData();
  }, [messages]);

  const UserOption = ({ innerProps, label, data }) => (
    <div {...innerProps} className="cursor-pointer">
      <img
        className="avatar ms-2 me-3"
        src={
          data.image ||
          `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
        }
        alt={data.name}
      />
      {label}
    </div>
  );
  return (
    <>
      <Helmet>
        <title>Messages · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent
          title={"Messages"}
          icon={<BsPlus />}
          onclick={() => setMessageData(true)}
          tag={"Create"}
        >
          <Row className="g-4">
            <Col md={4}>
              <div className="shadow rounded h-100 search-invoice2 last-child-none position-sticky top-0">
                <div className="py-3 rounded-top px-2 success-combo">
                  <span className="position-relative">
                    <BsSearch className="position-absolute top-50 me-3 end-0 translate-middle-y" />
                    <Form.Control
                      type="search"
                      value={search}
                      onChange={handleChange}
                      placeholder="Search..."
                      className="purple-combo me-2 pe-5"
                    />
                  </span>
                </div>
                <SimpleBar className="area pe-2">
                  {results.length > 0 ? null : (
                    <div className="text-center">
                      <img
                        className="p-3"
                        alt="no-result"
                        width="230"
                        src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                      />
                    </div>
                  )}
                  {results?.map((data, id1) => {
                    const isLinkActive =
                      receiverId === data?.sender_details?.id;
                    return (
                      <div key={id1} className="py-2 hr-border2">
                        <div
                          onClick={() =>
                            handlerMessage(data?.sender_details?.id)
                          }
                          className={`d-flex p-1 justify-content-between cursor-pointer ${
                            isLinkActive ? "danger-combo" : ""
                          }`}
                        >
                          <div className="d-flex flex-row">
                            <img
                              className="avatar ms-2 me-3"
                              src={
                                data?.sender_details?.image
                                  ? `${process.env.REACT_APP_API_URL}${data?.sender_details?.image}`
                                  : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                              }
                              alt={data?.sender_details?.name}
                            />
                            <div className="d-grid">
                              <p className="fw-bold mb-0 text-truncate pe-2">
                                {data?.sender_details?.name}
                              </p>
                              <p className="small mb-0 text-truncate">
                                {data?.message_content}
                              </p>
                            </div>
                          </div>
                          <div>
                            <p className="small mb-1 text-truncate">
                              {moment(data?.timestamp).fromNow(true)}
                            </p>
                            {data?.total_unread === 0 ? null : (
                              <Badge pill bg="danger" className="float-end">
                                {data?.total_unread}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </SimpleBar>
              </div>
            </Col>
            <Col md={8}>
              <Card className="shadow border-0 justify-content-center chat-area h-100">
                <SimpleBar className="p-2 area chat-area-image position-relative">
                  <Card.Body
                    className={`hide-scroll`}
                    style={{ overflowY: "scroll" }}
                    ref={chatWindowRef}
                  >
                    {singleMessage.length > 0 ? null : (
                      <div className="text-center">
                        <img
                          className="p-3"
                          alt="no-result"
                          width="230"
                          src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                        />
                      </div>
                    )}
                    {singleMessage.map((msg, index) => (
                      <React.Fragment key={index}>
                        <div
                          className={`d-flex flex-row mb-4 justify-content-end`}
                          style={{
                            direction: msg.sender_id === user.id ? null : "rtl",
                          }}
                        >
                          <div
                            className={`chat-width ${
                              msg.sender_id === user.id ? "me-3" : "ms-3"
                            }`}
                          >
                            <div
                              className={
                                msg.message_content?.length > 0
                                  ? `px-3 py-2`
                                  : null
                              }
                              style={{
                                borderRadius:
                                  msg.sender_id === user.id
                                    ? "15px 0 15px 15px"
                                    : "0 15px 15px 15px",
                                backgroundColor:
                                  msg.sender_id === user.id
                                    ? "rgb(255 255 255 / 35%)"
                                    : "rgba(57, 192, 237,.2)",
                                direction:
                                  msg.sender_id === user.id ? null : "ltr",
                              }}
                            >
                              <p className="small mb-0">
                                {msg.message_content}
                              </p>
                            </div>
                            <p
                              className={`fs-11 text-gray pt-2 mb-0 ${
                                msg.sender_id === user.id
                                  ? "text-end"
                                  : "text-start"
                              }`}
                            >
                              {" "}
                              <BsClock /> {moment(msg?.timestamp).fromNow(true)}
                            </p>
                          </div>
                          {msg.sender_id === user.id ? (
                            <ImageViewer
                              src={
                                user.image
                                  ? `${process.env.REACT_APP_API_URL}${user.image}`
                                  : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                              }
                            >
                              <img
                                className="avatar"
                                src={
                                  user.image
                                    ? `${process.env.REACT_APP_API_URL}${user.image}`
                                    : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                }
                              />
                            </ImageViewer>
                          ) : (
                            <ImageViewer
                              src={
                                msg?.recipient_details?.image
                                  ? `${process.env.REACT_APP_API_URL}${msg?.recipient_details?.image}`
                                  : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                              }
                            >
                              <img
                                className="avatar"
                                src={
                                  msg?.recipient_details?.image
                                    ? `${process.env.REACT_APP_API_URL}${msg?.recipient_details?.image}`
                                    : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                }
                              />
                            </ImageViewer>
                          )}
                        </div>

                        {msg?.attachment && (
                          <div
                            className={
                              msg.sender_id === user.id ? "text-end" : null
                            }
                          >
                            <ImageViewer
                              src={`${process.env.REACT_APP_API_URL}${msg?.attachment}`}
                            >
                              <img
                                height={80}
                                width={80}
                                className="shadow p-1 mb-4"
                                style={{ marginTop: "-15px" }}
                                src={`${process.env.REACT_APP_API_URL}${msg?.attachment}`}
                                alt={msg?.recipient_details?.name}
                              />
                            </ImageViewer>
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </Card.Body>
                </SimpleBar>
                {singleMessage.length > 0 ? (
                  <Form
                    className="shadow mt-2 rounded-bottom w-auto h-auto p-3"
                    onSubmit={handleSendMessage}
                  >
                    <div className="hstack gap-2">
                      <Form.Label
                        controlId="uploadfile"
                        className="mb-0 d-none"
                      >
                        <Form.Control
                          accept="image/*"
                          onChange={(e) => setNewImage(e.target.files[0])}
                          type="file"
                          className="d-none"
                        />
                        <div className="social-btn purple-combo d-align">
                          <BsPaperclip />
                        </div>
                      </Form.Label>
                      <TextareaAutosize
                        minRows={1}
                        className="edit-textarea"
                        placeholder="Type a message..."
                        name="remark"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                      />
                      <div className="vr hr-shadow" />
                      <button
                        type="submit"
                        className="social-btn-re w-auto success-combo border-0 gap-1 px-3 d-align"
                      >
                        Send <BiPaperPlane />
                      </button>
                    </div>
                  </Form>
                ) : null}
              </Card>
            </Col>
          </Row>
        </CardComponent>
      </Col>

      <Formik
        enableReinitialize={true}
        initialValues={{
          user_id: "",
        }}
        validationSchema={addMessageSchema}
        onSubmit={handleSubmit}
      >
        {(props) => (
          <Modaljs
            formikProps={props}
            open={messageData}
            size={"md"}
            closebtn={"Cancel"}
            Savebtn={"Add"}
            close={() => setMessageData(false)}
            title={"Add New User"}
          >
            <Col md={12}>
              <Form.Label>Select User</Form.Label>
              <Select
                menuPosition="fixed"
                className="text-primary w-100"
                name="user_id"
                options={allUserData?.map((user) => ({
                  label: user.name,
                  value: user.id,
                  image: user.image
                    ? `${process.env.REACT_APP_API_URL}${user.image}`
                    : null,
                }))}
                onChange={(selectedOption) =>
                  props.setFieldValue("user_id", selectedOption.value)
                }
                onBlur={props.handleBlur}
                isInvalid={Boolean(
                  props.touched.user_id && props.errors.user_id
                )}
                components={{ Option: UserOption }}
              />
              <small className="text-danger">{props.errors.user_id}</small>
            </Col>
          </Modaljs>
        )}
      </Formik>
    </>
  );
};

export default AllMessages;
