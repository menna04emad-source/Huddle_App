import { InfinitySpin } from 'react-loader-spinner'

export default function Loader() {
  return (
   <div className=" absolute h-screen w-full flex justify-center items-center ">
<InfinitySpin
width="200"
color="#f403fc"
/>
   </div>
  )
}
