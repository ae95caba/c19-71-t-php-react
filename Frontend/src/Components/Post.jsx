import React, { useRef, useEffect, useState } from "react";
import Avatar from "./Avatar";
import Comment from "./Comment";
export default function Post({ imageUrl, description, date, id, userId }) {
  const [avatar, setAvatar] = useState(`dummy image`);
  const [username, setUsername] = useState();
  const [comments, setComments] = useState();
  useEffect(() => {
    async function fetchUserData() {
      const apiUrl = `http://localhost:3000/users/${userId}`;
      try {
        const response = await fetch(apiUrl); // Replace with your actual API endpoint
        const data = await response.json();
        console.log(data);
        setAvatar(data.avatar);
        setUsername(data.username);
      } catch (error) {
        console.error("Error fetching posts:", error);
        // Handle errors gracefully, e.g., display an error message to the user
      }
    }

    fetchUserData(); // Call the function to fetch posts on component mount
  }, []);

  useEffect(() => {
    async function fetchComments() {
      const apiUrl = `http://localhost:3000/comments/${id}`;
      try {
        const response = await fetch(apiUrl); // Replace with your actual API endpoint
        const data = await response.json();
        console.log(data);
        setComments(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
        // Handle errors gracefully, e.g., display an error message to the user
      }
    }

    fetchComments(); // Call the function to fetch posts on component mount
  }, []);

  const dialogRef = useRef(null);

  function getPublicationDate(dateString) {
    const date = new Date(dateString);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date");
    }
    const now = new Date();
    const diff = now - date; // difference in milliseconds
    // console.log(`the diff is ${diff}`);
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) {
      return `hace ${days} d`;
    } else if (hours > 0) {
      return `hace ${hours} h`;
    } else {
      return `hace ${minutes} min`;
    }
  }

  function clickOutsideToClose(e) {
    console.log(`event listener running`);
    const modal = dialogRef.current;
    if (e.target === modal) {
      modal.close();
      //no need to removeEventListener, it closes itself
    }
  }

  function openModal() {
    const modal = dialogRef.current;
    modal.showModal();
    modal.addEventListener("click", clickOutsideToClose);
  }

  const commentsStyle = "flex items-center gap-4 p-6";

  return (
    <div>
      <dialog ref={dialogRef}>
        <div className="flex">
          <img
            src={imageUrl}
            alt=""
            className="  h-[90vh] border-2 border-solid border-black "
          />
          <ul className="flex flex-col justify-between">
            <div>
              <div className={`${commentsStyle} border-b-2`}>
                <Avatar imageUrl={avatar} /> <p>{username}</p>
              </div>
              {comments?.map((comment, index) => (
                <Comment
                  className={commentsStyle}
                  key={index}
                  date={comment.date}
                  getPublicationDate={getPublicationDate}
                  message={comment.comment}
                  author={{
                    name: comment.reviewerName,
                    avatar: "https://i.pravatar.cc/300",
                  }}
                />
              ))}
            </div>
            <form>
              <input type="text" placeholder="Agrega un comentario" />
              <button type="submit">Publicar</button>
            </form>
          </ul>
        </div>
      </dialog>
      <div className="flex flex-col gap-3 py-20">
        <div className="flex gap-3 items-center">
          <Avatar imageUrl={avatar} />
          <p className="font-bold flex gap-2">
            {username}
            <span>•</span>
            <span className="font-normal">{getPublicationDate(date)}</span>
          </p>
        </div>
        <div
          className="w-[468px] h-[585px] border-2 border-solid border-black bg-black flex items-center justify-center"
          onClick={openModal}
        >
          <img src={imageUrl} alt="" className="  bg-white max-h-full   " />
        </div>
      </div>
    </div>
  );
}
