import React, { useEffect, useState } from "react";
import Post from "../Components/Post";
import Category from "../Components/Category";
import { useSearchParams } from "react-router-dom";
import { Sidebar } from '../Components/Sidebar'

const numberOfPostToFetch = 12;

export default function Feed() {
  const [posts, setPosts] = useState([]); // Use an empty array for initial state
  const [numberOfPostFetched, setNumberOfPostFetched] =
    useState(numberOfPostToFetch);

  ////////////////////////////

  const [searchParams] = useSearchParams();

  // 1) FILTER
  const filterValue = searchParams.get("categoria") || "all";
  // let filteredPosts;

  console.log(filterValue);

  ////////////////////////////

  useEffect(() => {
    async function fetchPosts() {
      /* const apiUrl = `https://dummyjson.com/products?limit=${numberOfPostFetched}`; */
      const apiUrl = `http://localhost:3000/posts?limit=${numberOfPostFetched}`;
      try {
        const response = await fetch(apiUrl); // Replace with your actual API endpoint
        const data = await response.json();
        console.log(data);
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
        // Handle errors gracefully, e.g., display an error message to the user
      }
    }

    fetchPosts(); // Call the function to fetch posts on component mount
  }, [numberOfPostFetched]); // Empty dependency array to fetch posts only once on mount

  function handleScroll() {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
      document.documentElement.scrollHeight
    ) {
      setNumberOfPostFetched((prev) => prev + numberOfPostToFetch);
    }
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative">
      <div className=" flex bg-red-400"> 
    
        <Category />
        <Sidebar/>
      
      </div>
      

      {!posts ? (
        <p>Loading posts...</p>
      ) : (
        <ul className="flex flex-col   items-center  ">
          {posts.map((post) => (
            <Post
              key={post._id}
              imageUrl={post.imageURL}
              description={post.description}
              date={post.createdAt}
              userId={post.userId}
              id={post._id}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
