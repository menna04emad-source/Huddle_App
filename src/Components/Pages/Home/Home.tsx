import axios from "axios"
import Loader from "../../Loader/Loader";
import Post from "../Post/Post";
import type { Post as PostType } from "../../../Schemas/post.type";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import CreatePost from "../Createpost/CreatePost";




export default function Home() {
  console.log (new Date)
// const [isLoading,setisLoading] = useState(true);
// const [isError,setisError] = useState(false);
// const [allposts, setallposts] = useState<PostType[]>([]);
async function getAllposts() {
  const { data } = await axios.get(
    `https://route-posts.routemisr.com/posts?sort=_createdAt`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user Token")}`,
      },
    }
  );

  return data.data.posts
;
}


const{data, isLoading ,isError,error,isFetching} = useQuery ({
 queryKey : ['getAllposts'] ,
 queryFn : getAllposts ,
 retry : 3 ,
})
console.log ("data",data)
console.log ("loading",isLoading)
console.log ("iserror",isError)
console.log ("error",error)
console.log ("fetch",isFetching)

if (isLoading) {
  return <Loader/>
}
if (isError) {
  return toast.error ("Error")
}

  return (
    <>

       <div className="flex w-full flex-col items-center gap-6 px-3 py-5 sm:px-5 ">
        <CreatePost/>
       {data?.map((post : PostType) =>(
        
      
      <Post key={post._id} post={post} />
   ))}
        </div> 

    
    </>
  )
}
