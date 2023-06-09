import { SignIn, SignOutButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import {  api } from "~/utils/api";
import { SignInButton } from "@clerk/nextjs";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
import type { RouterOutputs } from "~/utils/api";
import Image from "next/image";
import LoadingSpinner from "~/components/loading";

dayjs.extend(relativeTime);

const CreatePostWizard = () =>{

  const {user} = useUser();

  console.log(user);

  if(!user) return null;

  return(
    <div className="flex gap-3 bg-red-200">
      <Image src={user?.profileImageUrl} 
      alt="Profile image"
      className="h-16 w-16 rounded-full"
      width = {56}
      height= {56}
      />
      <input 
        placeholder="Type some emojis" 
        className="bg-transparent grow" />
    </div>
  )

}


const LoadingPage = () => {
  return ( 
  <div className="absolute top-0 right-0 flex h-screen w-screen">
          <LoadingSpinner size={60} />
  </div> )
}

type PostWithUser = RouterOutputs["posts"]["getAll"][number]

 const PostView = (props :PostWithUser ) =>{

  const {post, author} = props;

  return(
    <div key={post.id} className="p-8 border-b border-slate-400 p-8 gap-3">
      <Image src={author.profileImageUrl}  
             className="h-16 w-16 rounded-full "
             alt={`@${author.username}'s profile picture`}
             width = {56} 
             height= {56}
            //  placeholder="blur"
             />
      <div className="flex flex-col">
        <div className="flex gap-2 font-bold">
          <span className="bg-brown">{`@${author?.username!}`}</span>
          <span className="font-thin">{`${dayjs(post.createdAt).fromNow()}`}</span>
        </div>
         <span>{post.content}</span>
      </div>
    </div>
  )
}


const Feed = () => {

  const {data, isLoading : postsLoading} = api.posts.getAll.useQuery();

  if(postsLoading) return <LoadingPage />
  
  if(!data) return <div>Something went wrong</div>

  return (
    <div className="flex flex-col">
            {[...data,...data]?.map((fullPost)=>(
              <PostView {...fullPost} key={fullPost.post.id} />
            ))}
           </div>
  )

}


const Home: NextPage = () => {
  // const {data} = api.example.getAll.useQuery();
  const {isLoaded :userLoaded,isSignedIn} = useUser();

  api.posts.getAll.useQuery();

  if(!userLoaded) return <div />
  
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex justify-center h-full h-screen">
           
          <SignIn />

           <div className="bg-red-200 max-w-2xl w-full broder-slate-200 border-x" >
            <div className="border-b border-slate-400 p-4">
            {/* <h1 className="color-white">Sign in</h1> */}
            {/* <SignInButton /> */}
            {!isSignedIn && <SignInButton/>}{!!isSignedIn &&  <CreatePostWizard/>}
           </div>
            <Feed />
           </div>
           
           {/* <SignIn /> */}
      </main>
    </>
  );
};

export default Home;